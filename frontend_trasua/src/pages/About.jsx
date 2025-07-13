import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import aboutImage from "../assets/images/banners/bn5.png"; // thay bằng hình của bạn

const Section = styled.section`
  padding: 80px 20px;
  background: linear-gradient(to right, #ffe6e6, #fff);
  text-align: center;
`;

const Title = styled(motion.h2)`
  font-size: 36px;
  font-weight: bold;
  color: #d63031;
  margin-bottom: 30px;
`;

const Content = styled(motion.p)`
  font-size: 18px;
  color: #333;
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.7;
`;

const Image = styled(motion.img)`
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const About = () => {
  return (
    <Section>
      <Title
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Về Feeling Tea
      </Title>

      <Content
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Tại Feeling Tea, chúng tôi tin rằng mỗi ly trà sữa là một trải nghiệm
        cảm xúc. Được pha chế từ những nguyên liệu tươi ngon và công thức độc
        quyền, mỗi sản phẩm đều mang đến sự hài lòng trọn vẹn từ vị giác đến cảm
        xúc. Chúng tôi không chỉ bán trà sữa – chúng tôi lan toả cảm xúc tích
        cực trong từng khoảnh khắc.
      </Content>

      <Image
        src={aboutImage}
        alt="About Feeling Tea"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      />
    </Section>
  );
};

export default About;
