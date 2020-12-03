<?php
// Add custom Theme Functions here
function tiendigAppConfirm()
{

    // Set UI labels for Custom Post Type
    $labels = array(
        'name'                => _x('Confirmaciones de pago', 'Post Type General Name', 'divi'),
        'singular_name'       => _x('Confirmación de pago', 'Post Type Singular Name', 'divi'),
        'menu_name'           => __('Confirmaciones de pago', 'divi'),
        'parent_item_colon'   => __('Parent Order', 'divi'),
        'all_items'           => __('Todas las confirmaciones', 'divi'),
        'view_item'           => __('Ver confirmación', 'divi'),
        'add_new_item'        => __('Agregar nueva confirmación', 'divi'),
        'add_new'             => __('Agregar confirmación', 'divi'),
        'edit_item'           => __('Editar confirmación', 'divi'),
        'update_item'         => __('Actualizar confirmación', 'divi'),
        'search_items'        => __('Buscar confirmación', 'divi'),
        'not_found'           => __('No encontrado', 'divi'),
        'not_found_in_trash'  => __('No encontrado en la basura', 'divi'),
    );

    // Set other options for Custom Post Type

    $args = array(
        'label'               => __('confirmaciones de pago', 'divi'),
        'description'         => __('Confirmaciones de pago de nuestros clientes', 'divi'),
        'labels'              => $labels,
        // Features this CPT supports in Post Editor
        'supports'            => array(
            'title',
            'editor',
            'thumbnail',
            'revisions',
            'custom-fields',
            'page-attributes',
        ),
        // You can associate this CPT with a taxonomy or custom taxonomy.
        /* A hierarchical CPT is like Pages and can have
            * Parent and child items. A non-hierarchical CPT
            * is like Posts.
            */
        'hierarchical'        => false,
        'public'              => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_admin_bar'   => true,
        'menu_position'       => 5,
        'menu_icon'       => 'dashicons-money-alt',
        'can_export'          => true,
        'has_archive'         => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'capability_type'     => 'post',
        'show_in_rest' => true,

    );

    // Registering your Custom Post Type
    register_post_type('confirmacionesdepago', $args);
}

add_action('init', 'tiendigAppConfirm');
