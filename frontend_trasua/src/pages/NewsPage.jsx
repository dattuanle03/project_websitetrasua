// src/pages/NewsPage.js
import React from "react";
import { Card } from "antd";
import { motion } from "framer-motion";
import styled from "styled-components";

const { Meta } = Card;

const newsData = [
  {
    id: 1,
    title: "Feeling Tea ra mắt hương vị mới: Trà sữa Tiramisu",
    description:
      "Hương vị ngọt ngào, béo nhẹ và thơm đặc trưng của tiramisu nay đã có mặt tại Feeling Tea.",
    image: require("../assets/images/banners/bn2.png"),
  },
  {
    id: 2,
    title: "Khuyến mãi hè 2025 – Giảm 20% toàn bộ topping",
    description:
      "Từ 15/6 đến 30/6, khi đặt hàng online, bạn sẽ được giảm giá đặc biệt cho mọi loại topping.",
    image: require("../assets/images/banners/bn3.png"),
  },
  {
    id: 3,
    title: "Giao hàng 10 phút khu vực Quận 8 – Tốc độ mới!",
    description:
      "Chúng tôi cam kết giao hàng trong vòng 10 phút cho khu vực Quận 8. Trải nghiệm tốc độ vượt trội!",
    image: require("../assets/images/banners/bn4.png"),
  },
];

const Grid = styled.div`
  display: grid;
  gap: 24px;
  padding: 100px 40px 40px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  background: #fff4f4;
  min-height: 100vh;
`;

const NewsPage = () => {
  return (
    <Grid>
      {newsData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            hoverable
            cover={
              <img
                alt={item.title}
                src={item.image}
                style={{ height: "200px", objectFit: "cover" }}
              />
            }
          >
            <Meta title={item.title} description={item.description} />
          </Card>
        </motion.div>
      ))}
    </Grid>
  );
};

export default NewsPage;
