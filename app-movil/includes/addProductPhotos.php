<?php


add_action('wp_ajax_nopriv_photoList', 'addPhotos');
add_action('wp_ajax_photoList', 'addPhotos');

function addPhotos()
{
    $image_url = 'adress img';

    $upload_dir = wp_upload_dir();

    $image_data = file_get_contents($image_url);

    $filename = basename($image_url);

    if (wp_mkdir_p($upload_dir['path'])) {
        $file = $upload_dir['path'] . '/' . $filename;
    } else {
        $file = $upload_dir['basedir'] . '/' . $filename;
    }

    file_put_contents($file, $image_data);

    $wp_filetype = wp_check_filetype($filename, null);

    $attachment = array(
        'post_mime_type' => $wp_filetype['type'],
        'post_title' => sanitize_file_name($filename),
        'post_content' => '',
        'post_status' => 'inherit'
    );

    $attach_id = wp_insert_attachment($attachment, $file);
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    $attach_data = wp_generate_attachment_metadata($attach_id, $file);
    wp_update_attachment_metadata($attach_id, $attach_data);



    /*************************************************************************/
    /*
    $nonce = $_REQUEST['nonce'];
    if ( !wp_verify_nonce( $nonce, "myCustomCartNonce")) {
        die("Get out, mf!");
    } */
    if (isset($_REQUEST["orderId"])) {
        $orderId = $_REQUEST["orderId"];
    }
    $order = get_post($orderId);
    $title = $order->post_title;
    $photoList = json_decode(get_post_meta($orderId, 'photoList', true));
    $newPhotoList = array();
    $photosUploaded = get_post_meta($orderId, 'photos_uploaded', true);
    $nextPhotoIndex = get_post_meta($orderId, 'next_photo_index', true);
    $pcNextIndex = get_post_meta($orderId, 'next_pc_index', true);
    $orderFolder = get_post_meta($orderId, 'uploadedFolder', true);
    $webPath = get_post_meta($orderId, 'webFolder', true);
    $webFolder = $webPath . 'uploaded/';
    $i = 0;
    $newNextPhotoIndex = 0;
    $newPcIndex = 0;
    $home = get_home_url();

    /*     $ordersUploadFolder = '/wp-content/uploads/productAppImages/';
    $targetPathBase = $_SERVER['DOCUMENT_ROOT'] . $ordersUploadFolder;
    if (!file_exists($targetPathBase)) {
        mkdir($targetPathBase, 0755, true);
    }
    $targetFolder = $title . '/';
    $targetPathOrder =  $targetPathBase . $targetFolder;
    if (!file_exists($targetPathOrder)) {
        mkdir($targetPathOrder, 0755, true);
    }
    $webPath = $home . $ordersUploadFolder . $targetFolder;
 */
    if (isset($_REQUEST) && isset($_FILES)) {
        foreach ($_FILES as $f => $file) {
            if ($orderId) {
                $pcIndex = $i + $pcNextIndex;
                $filename = "pc" . $pcIndex . ".jpg";
                //$filename = basename($file['name']);
                $targetFile = $orderFolder . $filename;
                //                $targetFile = $targetPathOrder . $filename;
                $webFile = $webFolder . $filename;
                array_push($photoList, $webFile);
                array_push($newPhotoList, $webFile);
                move_uploaded_file($file["tmp_name"], $targetFile);
                $photoIndex = $i + $nextPhotoIndex;
                $metaName = "Foto-" . $photoIndex;
                $metaValue = $webFile;
                add_post_meta($orderId, $metaName, $metaValue, true);
                $uploadOk = 1;
                $i += 1;

                $newPcIndex =  $i + $pcNextIndex;
                $newNextPhotoIndex =  $i + $nextPhotoIndex;
            }
        }
    }

    update_post_meta($orderId, "next_photo_index", $newNextPhotoIndex);
    update_post_meta($orderId, "next_pc_index", $newPcIndex);

    $totalPhotos = count($_FILES) + $photosUploaded;
    update_post_meta($orderId, "photos_uploaded", $totalPhotos);

    $newList = json_encode($photoList);
    $data = update_post_meta($orderId, 'photoList', $newList);

    $postContent = array();

    foreach ($photoList as $key => $value) {
        array_push($postContent, $value);
    }
    $jsonContent = json_encode($postContent);
    $args = array(
        'ID' => $orderId,
        'post_content' => $jsonContent,
    );

    /*Setting up our custom query */
    $data = wp_update_post($args);

    $response = array(
        'orderId' => $orderId,
        'post_content' => $jsonContent,
        'photos_uploaded' => $totalPhotos,
        'photoList' => $photoList,
        'newPhotoList' => $newPhotoList,
        'next_photo_index' => $newNextPhotoIndex,
    );

    echo json_encode($response);

    /* 
    $home = get_home_url();
    $urlCarga = $home . "/editor";

    wp_redirect($urlCarga . '?orderId=' . $orderId);*/
    wp_die();
}
