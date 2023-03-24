<?php

$dbhost = "localhost";
$dbemail = "root";
$dbpassword = "";
$dbname = "seniorproject";



if(!$con = mysqli_connect($dbhost,$dbemail,$dbpassword,$dbname)) {

    die("failed to connect!");
}










