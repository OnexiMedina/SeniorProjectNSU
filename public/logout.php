<?php
  
   if(isset($_GET['logout'])) {
      // clear the session variable, display logged out message
      unset($_SESSION["email"]);
      unset($_SESSION["password"]);
      
      echo 'You have Logged out!';
      header('Refresh: 1; URL = http://localhost/MAKE%20MY%20DAY/scheduler-component/public/login.php');
      //session_destroy();
  }
   
?>