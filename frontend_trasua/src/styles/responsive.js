// src/responsive.js
import styled from "styled-components";

/**
 * Wrapper hiển thị chỉ trên thiết bị di động (dưới 768px)
 */
export const MobileWrapper = styled.div`
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

/**
 * Wrapper hiển thị chỉ trên máy tính bảng (từ 768px đến 991px)
 */
export const TabletWrapper = styled.div`
  display: none;
  @media (min-width: 768px) and (max-width: 991px) {
    display: flex;
  }
`;

/**
 * Wrapper hiển thị chỉ trên máy tính (từ 992px trở lên)
 */
export const DesktopWrapper = styled.div`
  display: none;
  @media (min-width: 992px) {
    display: flex;
  }
`;
