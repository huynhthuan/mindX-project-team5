<?php
$uploads = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads\posts' . DIRECTORY_SEPARATOR;

// lấy tên gốc của ảnh
$filename = $_FILES['file']['name'];
// thay thế ký tự khoảng trắng bằng ký tự '-'
$filename = str_replace(' ', '-', $filename);
// thêm đoạn chuỗi không bị trùng đằng trước tên ảnh
$filename = uniqid() . '-' . $filename;

$target_path = $uploads . basename($filename);

move_uploaded_file($_FILES['file']['tmp_name'], $target_path);

// Trả về tên file upload
echo json_encode(array(
    'status' => 200,
    'url' => $filename,
));
