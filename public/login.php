<?php 

  session_start();

    include("connection.php");
    include("functions.php");
    

    if($_SERVER["REQUEST_METHOD"] == "POST") {
        // username and password sent from form 
        $email = $_POST['email'];
        $password = $_POST['password'];

        //Prevent mysqli injection error
        $email = stripcslashes($email);
        $password = stripcslashes($password);
        $email = mysqli_real_escape_string($con,$email);
        $password = mysqli_real_escape_string($con,$password); 
        
        $tableQuery = "SELECT * FROM users1 WHERE email = '$email' and password = '$password'";
        $result = mysqli_query($con,$tableQuery);
        $row = mysqli_fetch_array($result,MYSQLI_ASSOC);
        $count = mysqli_num_rows($result);
        
        // If result matched table row must be 1 row
          
        if($count == 1) {

           $_SESSION['email'] = $email;
           $_SESSION["password"] = $password;
           header("Location: http://localhost:3000");
           
        }else {
           echo "Your Email or Password is invalid";
        }
     }

?>

<!DOCTYPE html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <title>Login Form</title>
    <link rel="shortcut icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="./styleForms.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

</head>

<body>
    <div class="container">
        <div class="logo"><img src="./MMD LOGO.png"  alt="Make My Day Logo"> </div>
        <form method="post" class="form " id="login">
            <h1 class="form__title">Login</h1>
            <div class="form__message form__message--error"></div>

            <div class="form__input-group">
                <input type="text" name="email" class="form__input" autofocus placeholder="Email">
                <div class="form__input-error-message"></div>
            </div>

            <div class="form__input-group">
                <input type="password" name="password" class="form__input form__message--error" autofocus placeholder="Password">
                <div class="form__input-error-message"></div>
            </div>

            <button class="form__button" type="submit">Continue</button>

            

            <p class="form__text">
                <a class="form__link" href="signup.php" id="linkCreateAccount">Don't have an account? Create an account</a>
            </p>
        </form>
    </div>

    <script src="./Source/main.js"></script>
</body>