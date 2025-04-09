<?php
    $sql_lh = "SELECT * FROM tbl_lienhe WHERE id=1";
    $query_lh = mysqli_query($mysqli,$sql_lh);
?>
<table border="1" width="100%" style="border-collapse:collapse;">
    <?php
    while($dong = mysqli_fetch_array($query_lh)){ 
    ?>
        <p><?php echo $dong['thongtinlienhe'] ?></p>
    <?php
    }
    ?>
</table>