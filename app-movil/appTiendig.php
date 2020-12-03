<?php

/**
 * Tiendig App
 *
 * @package TiendigAppPackage
 * @author Tecnobunker
 * @copyright 2019 Tecnobunker
 * @license GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Tiendig App
 * Description: Plugin to adapt Tiendig to its mobile app.
 * Version: 0.1
 * Requires at least: 5.2
 * Requires PHP: 7.2
 * Author: Tecnobunker
 * Author URI: https://tecnobunker.net/
 * License: GPL v2 or later
 * WC requires at least: 2.2
 * WC tested up to: 2.3
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: app-plugin
 */
//https://code.tutsplus.com/tutorials/writing-extensible-plugins-with-actions-and-filters--wp-26759
//https://code.tutsplus.com/tutorials/create-a-custom-shipping-method-for-woocommerce--cms-26098
//https://code.tutsplus.com/es/tutorials/adding-custom-hooks-in-wordpress-custom-actions--cms-26454

// If this file is called directly, abort.

if (!defined('ABSPATH')) {
    exit;
}

define('TIENDIG_APP_VERSION', '1.0.0');
define('TIENDIG_APP_MINIMUM_WP_VERSION', '3.2');
define('TIENDIG_APP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TIENDIG_APP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TIENDIG_APP_DELETE_LIMIT', 100000);
/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
/**
 * Check if WooCommerce is active
 **/


if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    // Put your plugin code here

    /*     register_activation_hook( __FILE__, array( 'Akismet', 'plugin_activation' ) );
    register_deactivation_hook( __FILE__, array( 'Akismet', 'plugin_deactivation' ) );
    
    require_once( AKISMET__PLUGIN_DIR . 'class.akismet.php' );
    require_once( AKISMET__PLUGIN_DIR . 'class.akismet-widget.php' );
    
    add_action( 'init', array( 'Akismet', 'init' ) );
    
    if ( is_admin() ) {
        require_once( AKISMET__PLUGIN_DIR . 'class.akismet-admin.php' );
        add_action( 'init', array( 'Akismet_Admin', 'init' ) );
    } */

    function tiendigapp_activate()
    {
        // Trigger our function that registers the custom post type plugin.
        // Clear the permalinks after the post type has been registered.

        flush_rewrite_rules();
    }
    register_activation_hook(__FILE__, 'tiendigapp_activate');

    function tiendigapp_deactivate()
    {
        // Unregister the post type, so the rules are no longer in memory.
        include_once(TIENDIG_APP_PLUGIN_DIR . 'includes/unregisterOrderCPT.php');
        include_once(TIENDIG_APP_PLUGIN_DIR . 'includes/removeShipping.php');


        // Clear the permalinks to remove our post type's rules from the database.
        flush_rewrite_rules();
    }
    register_deactivation_hook(__FILE__, 'tiendigapp_deactivate');

    define('temp_file', ABSPATH . '/_temp_out.txt');

    add_action("activated_plugin", "activation_handler1");
    function activation_handler1()
    {
        $cont = ob_get_contents();
        if (!empty($cont)) file_put_contents(temp_file, $cont);
    }

    add_action("pre_current_active_plugins", "pre_output1");
    function pre_output1($action)
    {
        if (is_admin() && file_exists(temp_file)) {
            $cont = file_get_contents(temp_file);
            if (!empty($cont)) {
                echo '<div class="error"> Error Message:' . $cont . '</div>';
                @unlink(temp_file);
            }
        }
    }

    include_once(TIENDIG_APP_PLUGIN_DIR . 'includes/registerOrderCPT.php');
    include_once(TIENDIG_APP_PLUGIN_DIR . 'includes/confirmPayment.php');
    include_once(TIENDIG_APP_PLUGIN_DIR . 'includes/appShipping.php');
}
