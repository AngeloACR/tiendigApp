<?php


add_action('wp_ajax_nopriv_confirmPayment', 'confirmPayment');
add_action('wp_ajax_confirmPayment', 'confirmPayment');

function confirmPayment()
{
    /*
    $nonce = $_REQUEST['nonce'];
    if ( !wp_verify_nonce( $nonce, "myCustomCartNonce")) {
        die("Get out, mf!");
    } */
    $orderReference = $_REQUEST['orderReference'];
    $args = array(
        'post_type' => 'confirmacionesdepago',
        'meta_query' => array(
            array(
                'key' => 'pedido_asociado',
                'value' => $orderReference,
                'compare' => '=',
            )
        )
    );
    /*Setting up our custom query */
    //query_posts($args);
    $confirmationAux = wp_count_posts('confirmacionesdepago');
    $confirmationCount = $confirmationAux->publish;

    $confirmationList = new WP_Query($args);
    $confirmationTitle = 'Confirmaciones de la orden ' . $orderReference;

    if ($confirmationList->have_posts()) {
        $confirmationId = get_posts(array(
            'fields'          => 'ids',
            'post_type' => 'confirmacionesdepago'
        ))[0];
    } else {
        $confirmationArray = array(
            'post_type' => 'confirmacionesdepago',
            'post_title' => $confirmationTitle,
            'post_status' => 'publish',
            'comment_status' => 'closed', // if you prefer
            'ping_status' => 'closed', // if you prefer
        );
        $confirmationId = wp_insert_post($confirmationArray);
        add_post_meta($confirmationId, 'next_confirm_index', 0, true);
    }
    $home = get_home_url();
    $confirmCounter = get_post_meta($confirmationId, 'next_confirm_index', true);

    $i = 0;
    $newNextConfirmIndex = 0;

    $confirmationsFolder = '/wp-content/uploads/confirmations/';
    $targetPathBase = $_SERVER['DOCUMENT_ROOT'] . $confirmationsFolder;
    if (!file_exists($targetPathBase)) {
        mkdir($targetPathBase, 0755, true);
    }
    $targetFolder = $confirmationTitle . '/';
    $confirmationFolder =  $targetPathBase . $targetFolder;
    if (!file_exists($confirmationFolder)) {
        mkdir($confirmationFolder, 0755, true);
    }
    $webFolder = $home . $confirmationsFolder . $targetFolder;
    if (isset($_REQUEST) && isset($_FILES)) {
        foreach ($_FILES as $f => $file) {
            $name = $file['name'];
            $aux = explode(".", $name);
            $ext = end($aux);
            $confirmIndex = $i + $confirmCounter;
            $filename = "confirmation" . $confirmIndex . "." . $ext; //GET FILE EXTENSION

            $targetFile = $confirmationFolder . $filename;
            $webFile = $webFolder . $filename;

            move_uploaded_file($file["tmp_name"], $targetFile);

            add_post_meta($confirmationId, 'ubicacion_confirmacion_servidor_' . $confirmIndex, $targetFile, true);
            add_post_meta($confirmationId, 'ubicacion_confirmacion_link_' . $confirmIndex, $webFile, true);

            $i += 1;
            $newNextConfirmIndex = $i + $confirmCounter;
        }
    }
    add_post_meta($confirmationId, 'pedido_asociado', $orderReference, true); //OBTENER PEDIDO ASOCIADO DE ALGUNA MANERA
    update_post_meta($confirmationId, "next_confirm_index", $newNextConfirmIndex);

    $response = array(
        'request'        => $_REQUEST,
        'number'        => $newNextConfirmIndex,
        'confirm'        => $confirmationId,
    );

    echo json_encode($response);

    $zipFolder = $confirmationTitle . '/';
    $compressionFile = $confirmationTitle . '.zip';

    compressConfirm($confirmationFolder, $confirmationFolder, $compressionFile, $zipFolder);
    $message = 'Adjunto se encuentran las confirmaciones de pago de la orden';
    $fileToSend = $confirmationFolder . $compressionFile;
    wp_mail('confirmacionesdepago@tiendig.com', $confirmationTitle, $message, '', $fileToSend);
    wp_die();
}

function compressConfirm($sourceFolder, $targetFolder, $targetFile, $zipFolder)
{
    $zip = new ZipArchive();

    $filePath = $targetFolder . $targetFile;
    //$filePath = $targetFile;
    /*     if ($zip->open($targetFile, ZIPARCHIVE::CREATE) !== TRUE) {
        die("Unable to open Zip Archive ");
    }
 */
    if ($zip->open($filePath, ZIPARCHIVE::CREATE) !== TRUE) {
        die("Unable to open Zip Archive ");
    }

    if ($handle = opendir($sourceFolder)) {
        // Add all files inside the directory
        while (false !== ($entry = readdir($handle))) {

            $aux = explode(".", $entry);
            $ext = end($aux);

            if ($entry != "." && $entry != ".." && !is_dir($sourceFolder . $entry) && $ext != "zip") {
                $zip->addFile($sourceFolder . $entry, $zipFolder . $entry);
            }
        }
        closedir($handle);
    }
    $zip->close();
}
