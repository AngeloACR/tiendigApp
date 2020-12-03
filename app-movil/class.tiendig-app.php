<?php

class TiendigApp
{

    public static function init()
    {
        if (!self::$initiated) {
            self::init_hooks();
        }
    }

    /**
     * Initializes WordPress hooks
     */
    private static function init_hooks()
    {
        self::$initiated = true;

        add_action('wp_insert_comment', array('Akismet', 'auto_check_update_meta'), 10, 2);
        add_filter('preprocess_comment', array('Akismet', 'auto_check_comment'), 1);
        add_action('akismet_scheduled_delete', array('Akismet', 'delete_old_comments'));
        add_action('akismet_scheduled_delete', array('Akismet', 'delete_old_comments_meta'));
        add_action('akismet_schedule_cron_recheck', array('Akismet', 'cron_recheck'));

        $akismet_comment_nonce_option = apply_filters('akismet_comment_nonce', get_option('akismet_comment_nonce'));

        if ($akismet_comment_nonce_option == 'true' || $akismet_comment_nonce_option == '')
            add_action('comment_form',  array('Akismet',  'add_comment_nonce'), 1);

        add_action('admin_head-edit-comments.php', array('Akismet', 'load_form_js'));
        add_action('comment_form', array('Akismet', 'load_form_js'));
        add_action('comment_form', array('Akismet', 'inject_ak_js'));

        add_filter('comment_moderation_recipients', array('Akismet', 'disable_moderation_emails_if_unreachable'), 1000, 2);
        add_filter('pre_comment_approved', array('Akismet', 'last_comment_status'), 10, 2);

        add_action('transition_comment_status', array('Akismet', 'transition_comment_status'), 10, 3);

        // Run this early in the pingback call, before doing a remote fetch of the source uri
        add_action('xmlrpc_call', array('Akismet', 'pre_check_pingback'));
    }
    private static function bail_on_activation($message, $deactivate = true)
    {
?>
        <!doctype html>
        <html>

        <head>
            <meta charset="<?php bloginfo('charset'); ?>">
            <style>
                * {
                    text-align: center;
                    margin: 0;
                    padding: 0;
                    font-family: "Lucida Grande", Verdana, Arial, "Bitstream Vera Sans", sans-serif;
                }

                p {
                    margin-top: 1em;
                    font-size: 18px;
                }
            </style>

        <body>
            <p><?php echo esc_html($message); ?></p>
        </body>

        </html>
<?php
        if ($deactivate) {
            $plugins = get_option('active_plugins');
            $tiendig = plugin_basename(TIENDIG_APP_PLUGIN_DIR . 'appTiendig.php');
            $update  = false;
            foreach ($plugins as $i => $plugin) {
                if ($plugin === $tiendig) {
                    $plugins[$i] = false;
                    $update = true;
                }
            }

            if ($update) {
                update_option('active_plugins', array_filter($plugins));
            }
        }
        exit;
    }

    /**
     * Attached to activate_{ plugin_basename( __FILES__ ) } by register_activation_hook()
     * @static
     */
    public static function plugin_activation()
    {
        if (version_compare($GLOBALS['wp_version'], TIENDIG_APP_MINIMUM_WP_VERSION, '<')) {/* 
			load_plugin_textdomain( 'akismet' ); */

            $message = '<strong>' . sprintf(esc_html__('Tiendig App %s requiere WordPress %s o mayor.', 'divi'), TIENDIG_APP_VERSION, TIENDIG_APP_MINIMUM_WP_VERSION) . '</strong> ' . sprintf(__('Please <a href="%1$s">upgrade WordPress</a> to a current version, or <a href="%2$s">downgrade to version 2.4 of the Akismet plugin</a>.', 'akismet'), 'https://codex.wordpress.org/Upgrading_WordPress', 'http://wordpress.org/extend/plugins/akismet/download/');

            TiendigApp::bail_on_activation($message);
        }
    }

    /**
     * Removes all connection options
     * @static
     */
    public static function plugin_deactivation()
    {
        return self::deactivate_key(self::get_api_key());
    }

    /**
     * Essentially a copy of WP's build_query but one that doesn't expect pre-urlencoded values.
     *
     * @param array $args An array of key => value pairs
     * @return string A string ready for use as a URL query string.
     */
    public static function build_query($args)
    {
        return _http_build_query($args, '', '&');
    }

    /**
     * Log debugging info to the error log.
     *
     * Enabled when WP_DEBUG_LOG is enabled, but can be disabled via the akismet_debug_log filter.
     *
     * @param mixed $akismet_debug The data to log.
     */
    public static function log($akismet_debug)
    {
        if (apply_filters('akismet_debug_log', defined('WP_DEBUG_LOG') && WP_DEBUG_LOG)) {
            error_log(print_r(compact('akismet_debug'), true));
        }
    }

    public static function pre_check_pingback($method)
    {
        if ($method !== 'pingback.ping')
            return;

        global $wp_xmlrpc_server;

        if (!is_object($wp_xmlrpc_server))
            return false;

        // Lame: tightly coupled with the IXR class.
        $args = $wp_xmlrpc_server->message->params;

        if (!empty($args[1])) {
            $post_id = url_to_postid($args[1]);

            // If this gets through the pre-check, make sure we properly identify the outbound request as a pingback verification
            Akismet::pingback_forwarded_for(null, $args[0]);
            add_filter('http_request_args', array('Akismet', 'pingback_forwarded_for'), 10, 2);

            $comment = array(
                'comment_author_url' => $args[0],
                'comment_post_ID' => $post_id,
                'comment_author' => '',
                'comment_author_email' => '',
                'comment_content' => '',
                'comment_type' => 'pingback',
                'akismet_pre_check' => '1',
                'comment_pingback_target' => $args[1],
            );

            $comment = Akismet::auto_check_comment($comment);

            if (isset($comment['akismet_result']) && 'true' == $comment['akismet_result']) {
                // Lame: tightly coupled with the IXR classes. Unfortunately the action provides no context and no way to return anything.
                $wp_xmlrpc_server->error(new IXR_Error(0, 'Invalid discovery target'));
            }
        }
    }

    public static function pingback_forwarded_for($r, $url)
    {
        static $urls = array();

        // Call this with $r == null to prime the callback to add headers on a specific URL
        if (is_null($r) && !in_array($url, $urls)) {
            $urls[] = $url;
        }

        // Add X-Pingback-Forwarded-For header, but only for requests to a specific URL (the apparent pingback source)
        if (is_array($r) && is_array($r['headers']) && !isset($r['headers']['X-Pingback-Forwarded-For']) && in_array($url, $urls)) {
            $remote_ip = preg_replace('/[^a-fx0-9:.,]/i', '', $_SERVER['REMOTE_ADDR']);

            // Note: this assumes REMOTE_ADDR is correct, and it may not be if a reverse proxy or CDN is in use
            $r['headers']['X-Pingback-Forwarded-For'] = $remote_ip;

            // Also identify the request as a pingback verification in the UA string so it appears in logs
            $r['user-agent'] .= '; verifying pingback from ' . $remote_ip;
        }

        return $r;
    }

    /**
     * Ensure that we are loading expected scalar values from akismet_as_submitted commentmeta.
     *
     * @param mixed $meta_value
     * @return mixed
     */
    private static function sanitize_comment_as_submitted($meta_value)
    {
        if (empty($meta_value)) {
            return $meta_value;
        }

        $meta_value = (array) $meta_value;

        foreach ($meta_value as $key => $value) {
            if (!isset(self::$comment_as_submitted_allowed_keys[$key]) || !is_scalar($value)) {
                unset($meta_value[$key]);
            }
        }

        return $meta_value;
    }
}
