import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Modal, Button, message } from "antd";
import styled from "styled-components";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ButtonSearch from "../ButtonSearch/ButtonSearch";
import LoginRegister from "../auth/LoginRegister";
import { CartContext } from "../../contexts/CartContext";
import { ModalContext } from "../../contexts/ModalContext";
import { UserContext } from "../../contexts/UserContext";
import {
  MobileWrapper,
  TabletWrapper,
  DesktopWrapper,
} from "../../styles/responsive";
import { StyledButtonSearchWrapper } from "../ButtonSearch/ButtonSearch.styles";
const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  cursor: pointer;
`;
const UserCartWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 991px) {
    gap: 8px;
  }

  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const UserNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;
const UserOnlyName = styled.div`
  @media (max-width: 767px) {
    display: none; // 👉 ẩn tên ở mobile
  }
`;

// Styled Components
const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: 6px 0;
  font-size: 15px;
  display: block;
  line-height: 1.5;
  transition: color 0.2s ease;
  &:hover {
    color: #ffd6d6;
  }
`;
const WrapperMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const WrapperHeader = styled(Row)`
  position: fixed;
  top: 0;
  height: 79px;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
  padding: 14px 24px;
  color: #fff;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const WrapperTextHeader = styled.div`
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 767px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const WrapperTextHeaderSmall = styled.div`
  font-size: 12px;

  @media (max-width: 767px) {
    font-size: 10px;
  }

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
  position: relative;
  @media (max-width: 991px) {
    flex-direction: column;
    gap: 6px;
  }
`;
const MenuItem = styled.li`
  position: relative;
  padding: 10px;
  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    display: block;
    padding: 6px 12px;
    transition: color 0.2s ease;
  }
  &:hover > a {
    color: #ffd6d6;
  }
  @media (min-width: 992px) {
    &:hover > .submenu {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SubMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
  padding: 8px 0;
  border-radius: 12px;
  min-width: 140px;
  width: max-content;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  flex-direction: column;
  transform: translateY(10px);
  transition: all 0.25s ease;
  button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    padding: 14px 16px;

    &:hover {
      color: #fff;
      transform: scale(1.03);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
  @media (max-width: 991px) {
    position: relative;
    box-shadow: none;
    color: #fff;
    background: linear-gradient(to right, #ffafbd, #ffc3a0);
    z-index: 99999;
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;

  .cart-icon {
    position: relative;
    display: flex;
    align-items: center;
  }

  .cart-count {
    position: absolute;
    top: -9px;
    right: -6px;
    background-color: red;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  .cart-text {
    margin-left: 9px;

    @media (max-width: 991px) {
      display: none;
    }
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  left: 0;
  background: linear-gradient(to right, #ffafbd, #ffc3a0);
  padding: 12px 16px;
  z-index: 11111111;
  box-shadow: 0 2px 10px rgba(219, 108, 143, 0.1);
  display: ${(props) => (props.open ? "block" : "none")};
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.open ? 1 : 0)};
`;
//key 1
const getItemKey = (item) =>
  `${item.id_sanpham}_${item.size}_${item.ice}_${item.sugar}`;
//key 2
const makeItemKey = (item) =>
  `${item.id_sanpham}_${item.size}_${item.ice}_${item.sugar}`;
const HeaderComponent = ({ onSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems, cartCount, updateQuantity, removeFromCart } =
    useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const { showModal, setShowModal } = useContext(ModalContext);
  const [animate, setAnimate] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleLoginSuccess = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    message.success("Bạn đã đăng xuất thành công!");

    // 👉 Delay 1 giây rồi chuyển trang để người dùng kịp thấy thông báo
    setTimeout(() => {
      window.location.href = "http://localhost:3000/";
    }, 1000);
  };

  const handleOpenCart = () => {
    setCartVisible(true);
  };

  return (
    <>
      <WrapperHeader gutter={[8, 8]} align="middle">
        <Col xs={6} sm={6} md={8} lg={14} xl={14}>
          {" "}
          <MobileWrapper>
            <WrapperMenu style={{ justifyContent: "space-between" }}>
              <div
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => {
                  console.log(
                    "Toggle clicked, mobileMenuOpen:",
                    !mobileMenuOpen
                  );
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (mobileMenuOpen) setSubMenuOpen(false);
                }}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </div>
              <WrapperTextHeader>FEELING TEA</WrapperTextHeader>
            </WrapperMenu>
          </MobileWrapper>
          <TabletWrapper>
            <WrapperMenu
              style={{ justifyContent: "space-between", width: "100%" }}
            >
              <div
                style={{ fontSize: "25px", cursor: "pointer" }}
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (mobileMenuOpen) setSubMenuOpen(false);
                }}
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </div>
              <WrapperTextHeader>FEELING TEA</WrapperTextHeader>
            </WrapperMenu>
          </TabletWrapper>
          <DesktopWrapper>
            <WrapperMenu>
              <WrapperTextHeader>FEELING TEA</WrapperTextHeader>
              <Menu>
                <MenuItem>
                  <a href="/">Trang Chủ</a>
                </MenuItem>
                <MenuItem>
                  <MenuButton
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("section_product");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", "#section_product");
                      } else {
                        navigate("/#section_product");
                      }
                    }}
                  >
                    Sản phẩm
                  </MenuButton>
                  <SubMenu className="submenu">
                    <button onClick={() => navigate("/category/trasua")}>
                      Trà sữa
                    </button>
                    <button onClick={() => navigate("/category/hongtra")}>
                      Hồng trà
                    </button>
                    <button onClick={() => navigate("/category/yakult")}>
                      Yakult
                    </button>
                    <button onClick={() => navigate("/category/tra")}>
                      Trà
                    </button>
                    <button onClick={() => navigate("/category/topping")}>
                      Topping
                    </button>
                  </SubMenu>
                </MenuItem>
                <MenuItem>
                  <a href="#footer">Liên Hệ</a>
                </MenuItem>
                <MenuItem>
                  <a href="/news">Tin tức</a>
                </MenuItem>
                <MenuItem>
                  <a href="/about">Giới thiệu</a>
                </MenuItem>
              </Menu>
            </WrapperMenu>
          </DesktopWrapper>
        </Col>
        <Col xs={12} sm={14} md={8} lg={6} xl={6}>
          {" "}
          <StyledButtonSearchWrapper>
            <ButtonSearch
              size="large"
              placeholder="Bạn muốn tìm gì..."
              textButton="Tìm kiếm"
              onSearch={onSearch}
            />
          </StyledButtonSearchWrapper>
        </Col>
        <Col
          xs={6}
          sm={4}
          md={8}
          lg={4}
          xl={4}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <UserCartWrapper>
            <UserInfoWrapper
              onClick={() => {
                if (!user) {
                  setShowModal(true);
                } else {
                  navigate("/profile");
                }
              }}
            >
              {user?.avatar ? (
                <img
                  src={`http://localhost/WebsiteTraSua/uploads/avatars/${user.avatar}`}
                  alt="avatar"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <UserOutlined style={{ fontSize: "24px" }} />
              )}

              <UserNameWrapper>
                {/* 👉 Tên người dùng - ẩn khi mobile */}
                {user ? (
                  <>
                    <UserOnlyName>
                      <WrapperTextHeaderSmall>
                        {user.name}
                      </WrapperTextHeaderSmall>
                    </UserOnlyName>
                    <div onClick={handleLogout} style={{ cursor: "pointer" }}>
                      <WrapperTextHeaderSmall>Đăng xuất</WrapperTextHeaderSmall>
                    </div>
                  </>
                ) : (
                  <WrapperTextHeaderSmall>...</WrapperTextHeaderSmall>
                )}
              </UserNameWrapper>
            </UserInfoWrapper>

            <CartIconWrapper
              className={animate ? "animate" : ""}
              onClick={handleOpenCart}
            >
              <div className="cart-icon">
                <ShoppingCartOutlined
                  style={{ fontSize: "26px", color: "#fff" }}
                />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </div>
              <div className="cart-text">
                <WrapperTextHeaderSmall
                  style={{ fontSize: "15px", color: "#fff" }}
                >
                  Giỏ hàng
                </WrapperTextHeaderSmall>
              </div>
            </CartIconWrapper>
          </UserCartWrapper>
        </Col>
      </WrapperHeader>
      <MobileMenu open={mobileMenuOpen}>
        {console.log("MobileMenu open prop:", mobileMenuOpen)}
        <Menu>
          <MenuItem>
            <a href="/" onClick={() => setMobileMenuOpen(false)}>
              Trang Chủ
            </a>
          </MenuItem>
          <MenuItem>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                setSubMenuOpen(!subMenuOpen);
              }}
            >
              Sản phẩm {subMenuOpen ? "▼" : "▶"}
            </MenuButton>
            <SubMenu
              className="submenu"
              style={{ display: subMenuOpen ? "flex" : "none" }}
            >
              <button
                onClick={() => {
                  navigate("/category/trasua");
                  setMobileMenuOpen(false);
                }}
              >
                Trà sữa
              </button>
              <button
                onClick={() => {
                  navigate("/category/hongtra");
                  setMobileMenuOpen(false);
                }}
              >
                Hồng trà
              </button>
              <button
                onClick={() => {
                  navigate("/category/yakult");
                  setMobileMenuOpen(false);
                }}
              >
                Yakult
              </button>
              <button
                onClick={() => {
                  navigate("/category/tra");
                  setMobileMenuOpen(false);
                }}
              >
                Trà
              </button>
              <button
                onClick={() => {
                  navigate("/category/topping");
                  setMobileMenuOpen(false);
                }}
              >
                Topping
              </button>
            </SubMenu>
          </MenuItem>
          <MenuItem>
            <a href="#footer" onClick={() => setMobileMenuOpen(false)}>
              Liên hệ
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/news" onClick={() => setMobileMenuOpen(false)}>
              Tin tức
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/about" onClick={() => setMobileMenuOpen(false)}>
              Giới thiệu
            </a>
          </MenuItem>
        </Menu>
      </MobileMenu>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        zIndex={3000}
        title="Đăng nhập / Đăng ký"
      >
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      </Modal>
      <Modal
        open={cartVisible}
        onCancel={() => setCartVisible(false)}
        footer={null}
        title="Giỏ hàng của bạn"
        width="90%" // ✅ Thay vì cố định 700px
        style={{ top: 79, maxWidth: "700px", margin: "0 auto" }} // ✅ Căn giữa
      >
        {cartItems.length === 0 ? (
          <p>Giỏ hàng trống.</p>
        ) : (
          <div
            style={{
              maxHeight: "600px",
              overflowY: "auto",
              paddingRight: 10,
              paddingBottom: 10,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={
                  cartItems.length > 0 &&
                  selectedItems.length === cartItems.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(
                      cartItems.map((item) => makeItemKey(item))
                    );
                  } else {
                    setSelectedItems([]);
                  }
                }}
              />{" "}
              Chọn tất cả
            </div>
            {cartItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexWrap: "wrap", // ✅ Cho phép xuống dòng nếu hẹp
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "16px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "8px",
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(makeItemKey(item))}
                  onChange={(e) => {
                    const key = makeItemKey(item);
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, key]);
                    } else {
                      setSelectedItems(selectedItems.filter((k) => k !== key));
                    }
                  }}
                />

                {/* Ảnh sản phẩm */}
                <img
                  src={`http://localhost/WebsiteTraSua/uploads/products/${item.hinhanh}`}
                  alt={item.tensanpham}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    flexShrink: 0,
                  }}
                />

                {/* Thông tin sản phẩm */}
                <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
                  <h4 style={{ margin: 0 }}>{item.tensanpham}</h4>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Size: {item.size} | Đá: {item.ice} | Đường: {item.sugar}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Giá: {Number(item.giasp).toLocaleString()}₫
                  </p>
                </div>

                {/* Tăng giảm số lượng */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Button
                    size="small"
                    onClick={() =>
                      updateQuantity(
                        item.id_sanpham,
                        item.size,
                        item.ice,
                        item.sugar,
                        -1
                      )
                    }
                  >
                    -
                  </Button>
                  <span style={{ minWidth: 24, textAlign: "center" }}>
                    {item.quantity}
                  </span>
                  <Button
                    size="small"
                    onClick={() =>
                      updateQuantity(
                        item.id_sanpham,
                        item.size,
                        item.ice,
                        item.sugar,
                        1
                      )
                    }
                  >
                    +
                  </Button>
                </div>

                {/* Nút xoá */}
                <Button
                  type="link"
                  danger
                  size="small"
                  onClick={() =>
                    removeFromCart(
                      item.id_sanpham,
                      item.size,
                      item.ice,
                      item.sugar
                    )
                  }
                >
                  Xoá
                </Button>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "27px",
              right: "27px",
              background: "#fff",
              textAlign: "right",
            }}
          >
            <Button
              type="primary"
              style={{ width: "100%" }}
              disabled={selectedItems.length === 0}
              onClick={() => {
                if (!user) {
                  message.warning("Vui lòng đăng nhập để tiếp tục thanh toán!");
                  setShowModal(true);
                  return;
                }
                const selectedProducts = cartItems.filter((item) =>
                  selectedItems.includes(getItemKey(item))
                );

                if (selectedProducts.length === 0) {
                  message.error("Bạn chưa chọn sản phẩm nào để thanh toán.");
                  return;
                }

                localStorage.setItem(
                  "checkoutItems",
                  JSON.stringify(selectedProducts)
                );

                setCartVisible(false);
                window.location.href = "/cart";
              }}
            >
              Thanh toán ({selectedItems.length} sản phẩm)
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default HeaderComponent;
