import React from "react";
import styled from "styled-components";
import {
  FacebookFilled,
  YoutubeFilled,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons";

// Wrapper tổng
const FooterWrapper = styled.footer`
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
`;

// Phần trên của footer
const FooterTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 40px 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 30px 20px;
    gap: 30px;
    align-items: center;
  }
`;

// Mỗi cột
const Column = styled.div`
  flex: 1;
  min-width: 250px;
  margin: 10px;

  ul {
    padding-left: 20px;
    list-style: disc;
    line-height: 1.8;
  }

  li {
    font-size: 18px;
  }

  a {
    color: black;
    text-decoration: none;
  }

  span {
    font-size: 40px;
    font-weight: bold;
    color: rgb(249, 111, 111);
  }

  p {
    font-size: 18px;
    margin-top: 10px;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    span {
      font-size: 28px;
      text-align: center;
      display: block;
    }

    p,
    li {
      font-size: 16px;
      text-align: center;
    }

    ul {
      padding-left: 0;
      list-style: none;
      text-align: center;
    }

    a {
      text-align: center;
      display: block;
    }
  }
`;

// Phần dưới
const FooterBottom = styled.div`
  display: flex;
  background-color: rgb(252, 85, 85);
  padding: 10px 50px;
  font-size: 16px;
  justify-content: center;

  span,
  label {
    color: white;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    text-align: center;
    padding: 10px 20px;
  }
`;

const FooterComponent = () => {
  return (
    <FooterWrapper id="footer">
      <FooterTop>
        {/* CỘT 1 - Thông tin FELLING TEA */}
        <Column>
          <span>FEELING TEA</span>
          <p>
            FEELING TEA là một website <br />
            chuyên cung cấp các loại <br />
            nước uống hot nhất hiện tại
          </p>
        </Column>

        {/* CỘT 2 - Địa chỉ */}
        <Column>
          <ul>
            <li>
              Address: 32 Cao Lỗ, phường 4, quận 8,
              <br /> Tp.Hồ Chí Minh
            </li>
            <li>Hotline: 0375-202-500</li>
            <li>Email: trasuaruby6@gmail.com</li>
            <li>
              Website:{" "}
              <a href="https://trasuaruby6web.com">trasuarubyweb.com</a>
            </li>
          </ul>
        </Column>

        {/* CỘT 3 - Mạng xã hội */}
        <Column>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FacebookFilled style={{ fontSize: "28px", color: "#74c0fc" }} />
              <span style={{ fontSize: "16px", color: "black" }}>Facebook</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MailOutlined style={{ fontSize: "28px", color: "#f7af15" }} />
              <span style={{ fontSize: "16px", color: "black" }}>Email</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <InstagramOutlined
                style={{ fontSize: "28px", color: "#fd1919" }}
              />
              <span style={{ fontSize: "16px", color: "black" }}>
                Instagram
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <TwitterOutlined style={{ fontSize: "28px", color: "#74c0fc" }} />
              <span style={{ fontSize: "16px", color: "black" }}>Twitter</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <YoutubeFilled style={{ fontSize: "28px", color: "#fc2929" }} />
              <span style={{ fontSize: "16px", color: "black" }}>YouTube</span>
            </div>
          </div>
        </Column>
      </FooterTop>

      {/* PHẦN DƯỚI */}
      <FooterBottom>
        <span>
          &copy;2025 FEELING TEA ---- <label>Design by Đạt - Hiếu</label>
        </span>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default FooterComponent;
