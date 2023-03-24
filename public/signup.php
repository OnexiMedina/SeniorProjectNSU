
<?php 

  session_start();
    include("connection.php");
    include("functions.php");

    if($_SERVER['REQUEST_METHOD'] == "POST") {

        //Something was posted from form
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Add variable for password 2, make sure to check password matches before submitting to database

            if(!empty($email) && !empty($password) && !is_numeric($email)) 
            {

                //Prevent mysqli injection error
                $email = stripcslashes($email);
                $password = stripcslashes($password);
                $email = mysqli_real_escape_string($con,$email);
                $password = mysqli_real_escape_string($con,$password); 
                
                $tableQuery = "SELECT * FROM users1 WHERE email = '$email'";
                $result = mysqli_query($con,$tableQuery);
                $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
                $count = mysqli_num_rows($result);
                
                // If result matched table row must be 1 row
                
                if($count == 1) {

                    echo "User already exists! Please choose another email.";
                
                }
                else {

                    //Save to Database
                    $user_id = random_num(20);
                    //$user_id = 1111;
                    $query = "insert into users1 (user_id, email, password) values ('$user_id', '$email' , '$password')";

                    mysqli_query($con, $query);

                    header("Location: ./login.php");
                    die;
                }
            }
            else 
            {
                echo "Please enter valid email";
            }
    }

?>



<!DOCTYPE html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <title>Sign up</title>
    <link rel="shortcut icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="./styleForms2.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>

<body>
    <div class="logo"><img src="./MMD LOGO.png"  alt="Make My Day"> </div>
    <div class="container">

        <form method="post" class="form " id="createAccount">
            <h1 class="form__title">Create Account</h1>
            <div class="form__message form__message--error"></div>

            <div class="form__input-group">
                <input type="text" name="email" class="form__input" autofocus placeholder="Email">
                <div class="form__input-error-message"></div>
            </div>

            <div class="form__input-group">
                <input type="password" name="password" class="form__input form__message--error" autofocus placeholder="Password">
                <div class="form__input-error-message"></div>
            </div>

            <div class="form__input-group">
                <input type="password" name="password2" class="form__input form__message--error" autofocus placeholder="Confirm password">
                <div class="form__input-error-message"></div>
            </div>

            <button class="form__button" type="submit">Continue</button>

            <p class="form__text">
                <a class="form__link" href="login.php" id="linkLogin">Already have an account? Log in</a>
            </p>
        </form>

    </div>

    
</body>