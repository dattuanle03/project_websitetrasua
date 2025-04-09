<!-- <?php
    include"PHPMailer/src/PHPMailer.php";
    include"PHPMailer/src/Exception.php";
    include"PHPMailer/src/OAuth.php";
    include"PHPMailer/src/POP3.php";
    include"PHPMailer/src/SMTP.php";

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    $mail = new PHPMailer(true);
    // print_r($mail);
    try {
        //Server settings
        $mail ->SMTPDebug = 0;
        $mail ->isSMTP();
        $mail ->Host = 'smtp@gmail.com'; 
        $mail ->SMTPAuth = true;
        $mail ->Username = 'letuandat15012003@gmail.com';
        $mail ->Password = '';
        $mail ->SMTPSecure = 'tls';
        $mail -> Port = 587;

        //Recipients
        $mail ->setFrom('letuandat15012003@gmail.com','Mailer');

        $mail ->addAddress('levanhieu14102k3@gmail.com','Văn Hiếu');
        $mail ->addAddress('datletuan123456@gmail.com','Tuấn Đạt');

        // $mail ->addReplyTo('info@example.com','Information');
        // $mail ->addCC('cc@example.com');
        // $mail ->addBCC('bcc@example.com');

        //Attachments
        // $mail ->addAttachment('/var/tmp/file.tar.gz');
        // $mail ->addAttachment('/tmp/images.jpg','new.jpg');

        //Content
        $mail ->isHTML(true);
        $mail ->Subject = 'Hello Bạn Hiếu';
        $mail ->Body = 'Tui thử mail !';
        // $mail ->AltBody = 'This is the body in plain text for non-HTML email clients';

        $mail ->send();
        echo 'Message has been sent';

    }catch(Exception $e){

        echo 'Message could not be sent. Error!!' , $mail->$ErrorInfo;
    }
?> -->