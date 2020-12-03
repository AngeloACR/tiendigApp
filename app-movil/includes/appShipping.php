<?php
function delivery_init()
{
    if (!class_exists('WC_Delivery')) {
        class WC_Delivery extends WC_Shipping_Method
        {
            /**
             * Constructor for your shipping class
             *
             * @access public
             * @return void
             */
            public function __construct()
            {
                $this->id                 = 'delivery';
                $this->instance_id                 = 'instance_delivery';
                $this->method_description = __('Delivery de productos en mi ciudad'); // 
                $this->supports              = array(
                    'shipping-zones',
                    'instance-settings',
                    'settings',
                    'instance-settings-modal',
                );
                $this->enabled = 'yes';
                $this->method_title = 'Delivery en mi ciudad';
                $this->title = $this->method_title;
                $this->init();
            }

            function init_form_fields()
            {
            }
            /**
             * Init your settings
             *
             * @access public
             * @return void
             */
            function init()
            {
                // Load the settings API
                $this->init_form_fields(); // This is part of the settings API. Override the method to add your own settings
                $this->init_settings(); // This is part of the settings API. Loads settings you previously init.

                // Save settings in admin if you have any defined
                add_action('woocommerce_update_options_shipping_' . $this->id, array($this, 'process_admin_options'));
            }

            /**
             * calculate_shipping function.
             *
             * @access public
             * @param mixed  $package  
             * @return void
             */
            public function calculate_shipping($package = array())
            {
                $rate = array(
                    'label'    => "Tarifa única",
                    'cost'     => '1',
                    'calc_tax' => 'per_item'
                );

                // Register the rate
                $this->add_rate($rate);
            }
        }
    }
}

add_action('woocommerce_shipping_init', 'delivery_init');

function carga_pesada_init()
{
    if (!class_exists('WC_Carga_Pesada')) {
        class WC_Carga_Pesada extends WC_Shipping_Method
        {
            /**
             * Constructor for your shipping class
             *
             * @access public
             * @return void
             */
            public function __construct()
            {
                $this->id                 = 'carga_pesada';
                $this->instance_id                 = 'instance_carga_pesada';
                $this->method_description = __('Aplica a electrodomésticos y otros con pesos superiores a 15kg: cobro a destino'); // 
                $this->supports              = array(
                    'shipping-zones',
                    'instance-settings',
                    'settings',
                    'instance-settings-modal',
                );
                $this->enabled = 'yes';
                $this->method_title = 'Carga pesada';
                $this->title = $this->method_title;
                $this->init();
            }

            function init_form_fields()
            {
            }

            /**
             * Init your settings
             *
             * @access public
             * @return void
             */
            function init()
            {
                // Load the settings API
                $this->init_form_fields(); // This is part of the settings API. Override the method to add your own settings
                $this->init_settings(); // This is part of the settings API. Loads settings you previously init.

                // Save settings in admin if you have any defined
                add_action('woocommerce_update_options_shipping_' . $this->id, array($this, 'process_admin_options'));
            }
            /**
             * calculate_shipping function.
             *
             * @access public
             * @param mixed  $package  
             * @return void
             */
            public function calculate_shipping($package = array())
            {
                $rate = array(
                    'label'    => "Cobro a destino",
                    'cost'     => '0',
                    'calc_tax' => 'per_item'
                );

                // This is where you'll add your rates
            }
        }
    }
}

add_action('woocommerce_shipping_init', 'carga_pesada_init');

function envio_regional_init()
{
    if (!class_exists('WC_Envio_Regional')) {
        class WC_Envio_Regional extends WC_Shipping_Method
        {
            /**
             * Constructor for your shipping class
             *
             * @access public
             * @return void
             */
            public function __construct()
            {
                $this->id                 = 'envio_regional';
                $this->instance_id                 = 'instance_envio_regional';
                $this->method_description = __('Aplica a cualquier producto que compres fuera de tu ciudad: cobro a destino'); // 
                $this->supports              = array(
                    'shipping-zones',
                    'instance-settings',
                    'settings',
                    'instance-settings-modal',
                );
                $this->enabled = 'yes';
                $this->method_title = 'Envío regional';
                $this->title = $this->method_title;
                $this->init();
            }

            function init_form_fields()
            {
            }

            /**
             * Init your settings
             *
             * @access public
             * @return void
             */
            function init()
            {
                // Load the settings API
                $this->init_form_fields(); // This is part of the settings API. Override the method to add your own settings
                $this->init_settings(); // This is part of the settings API. Loads settings you previously init.

                // Save settings in admin if you have any defined
                add_action('woocommerce_update_options_shipping_' . $this->id, array($this, 'process_admin_options'));
            }

            /**
             * calculate_shipping function.
             *
             * @access public
             * @param mixed  $package  
             * @return void
             */
            public function calculate_shipping($package = array())
            {
                $rate = array(
                    'label'    => "Cobro a destino",
                    'cost'     => '0',
                    'calc_tax' => 'per_item'
                );

                // Register the rate
                $this->add_rate($rate);
            }
        }
    }
}

add_action('woocommerce_shipping_init', 'envio_regional_init');

//add_action('woocommerce_shipping_init', 'addAppZone');


function addingCustomMethods($methods)
{
    $methods['delivery'] = 'WC_Delivery';
    $methods['envio_regional'] = 'WC_Envio_Regional';
    $methods['carga_pesada'] = 'WC_Carga_Pesada';
    return $methods;
}

add_filter('woocommerce_shipping_methods', 'addingCustomMethods');
