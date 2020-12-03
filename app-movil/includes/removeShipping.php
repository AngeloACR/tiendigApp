<?php


function unsetMethods($methods)
{
    unset($methods['delivery']);
    unset($methods['envio_regional']);
    unset($methods['carga_pesada']);
    return $methods;
}

add_filter('woocommerce_shipping_methods', 'unsetMethods');
