<?php
error_reporting(E_ALL);

set_time_limit(0);

spl_autoload_register(function ($className) {
    $path = str_replace('\\', '/', $className) . '.php';

    if (file_exists($path)) {
        require_once($path);
    } else {
        throw new Exception('Class "' . $className . '" is not found');
    }
});

set_exception_handler(function (Exception $exception) {
    echo "Exception: " . $exception->getMessage() . "\n";
});