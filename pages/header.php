<?php
header("Access-Control-Allow-Origin: *");
?>
<div class="aspect-ratio-169">
    <img src="img/bn1.png" alt="" />
    <img src="img/bn2.png" alt="" />
    <img src="img/bn3.png" alt="" />
</div>
<!-- <div class="dot-container">
    <div class="dot active"></div>
    <div class="dot"></div>
    <div class="dot"></div>
</div> -->

<style>
.aspect-ratio-169 {
    display: block;
    position: relative;
    padding-top: 500px;
    transition:all 0.3s ease;
    width: 100%;
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 2px solid brown;
  }
  .aspect-ratio-169 img {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
.dot-container {
    height: 30px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.dot {
    height: 15px;
    width: 15px;
    background-color: #cccccc;
    border-radius: 50%;
    margin-right: 12px;
    cursor: pointer;
}
.dot.active {
    background-color: #333;
}
</style>

<script>
    const imgPosition =document.querySelectorAll(".aspect-ratio-169 img")
const imgContainer = document.querySelector('.aspect-ratio-169 ')
const dotItem =document.querySelectorAll(".dot")
let imgNumber = imgPosition.length
let index =0
imgPosition.forEach(function(image,index){
    image.style.left = index*100 + "%"
    dotItem[index].addEventListener("click",function(){
    slider (index)
    })
})
function imgSlide (){
    index++;
    console.log(index)
    if(index >=imgNumber){index=0 }
    slider (index)
}
function slider (index){
    imgContainer.style.left = "-" + index*100 +"%"
    const docActive =document.querySelector('.active')
    docActive.classList.remove("active")
    dotItem[index].classList.add("active")
}
//setInterval(imgSlide,2000)
</script>