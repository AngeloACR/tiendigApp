<?php
if (!defined('ABSPATH')) {
    exit;
}

if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

register_uninstall_hook(__FILE__, 'pluginUninstall');

function pluginUninstall()
{
}
