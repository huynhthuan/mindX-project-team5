<?php
$uploads = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads\user' . DIRECTORY_SEPARATOR;

// lấy tên gốc của ảnh
$filename = $_FILES['file_upload']['name'];
// thay thế ký tự khoảng trắng bằng ký tự '-'
$filename = str_replace(' ', '-', $filename);
// thêm đoạn chuỗi không bị trùng đằng trước tên ảnh
$filename = uniqid() . '-' . $filename;

$target_path = $uploads . basename($filename);

move_uploaded_file($_FILES['file_upload']['tmp_name'], $target_path);

// Trả về tên file upload
echo json_encode($filename);
