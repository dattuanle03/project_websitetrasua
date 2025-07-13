import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderComponent.css";

// ✅ Import ảnh banner trực tiếp từ src/assets/images
import bn1 from "../../assets/images/banners/bn1.png";
import bn2 from "../../assets/images/banners/bn2.png";
import bn3 from "../../assets/images/banners/bn6.png";

const SliderComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const banners = [
    {
      id: 1,
      image: bn1,
      title: "Ưu đãi mùa hè – Giảm giá lên đến 30% tất cả món trà sữa!",
    },
    {
      id: 2,
      image: bn2,
      title: "Miễn phí giao hàng toàn quốc cho đơn từ 2 ly trở lên!",
    },
    {
      id: 3,
      image: bn3,
      title: "Thưởng thức hương vị mới: Trà sữa Macchiato kem cheese thơm béo!",
    },
  ];

  return (
    <div className="slider-wrapper">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className="slider-item">
            <img
              src={banner.image}
              alt={banner.title}
              className="slider-image"
            />
            <h3 className="slider-title">{banner.title}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
