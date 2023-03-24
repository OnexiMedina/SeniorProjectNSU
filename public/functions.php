<?php


 function check_login($con){

    if(isset($_SESSION['email'])){
        $email = $_SESSION['email'];
        $email = stripcslashes($email);
        $email = mysqli_real_escape_string($con,$email);
        $query = "select * from users1 where email = '$email' limit 1";

        $result = mysqli_query($con,$query);

        if($result && mysqli_num_rows($result) > 0) {

            $user_data = mysqli_fetch_assoc($result);
            return $user_data; //return events of user and tables
        }
    }
    
    //else redirect to login

    header("Location: login.php");
    die;


} 


function random_num($length)
{
    $text = "";

    if($length < 5){
        $length = 5;
    }

    $len = rand(4,$length);

    for ($i=0; $i < $len; $i++){

        $text = rand(0,9);
    }

    return $text;
}

















