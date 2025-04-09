<?php
    $mysqli = new mysqli("localhost","root","","web_trasuaruby");

    if ($mysqli ->connect_error) {
        echo "Kết nối MYSQLI lỗi" . $mysqli -> connect_error;
        exit();
    }
    mysqli_set_charset($mysqli, "utf8mb4");
?>