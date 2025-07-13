import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Tabs, Avatar, message, Button } from "antd";
import AccountUpdateForm from "../components/auth/AccountUpdateForm";
import OrdersPage from "../pages/OrdersPage";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 60px 90px;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }

  h1 {
    font-size: 28px;

    @media (max-width: 768px) {
      padding-top: 10px;
      font-size: 20px;
      text-align: center;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .info-text {
    font-size: 16px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  useEffect(() => {
    console.log("Ảnh đại diện hiện tại:", user?.avatar);
  }, [user?.avatar]);

  if (!user) {
    return <p>Bạn cần đăng nhập để xem thông tin cá nhân.</p>;
  }

  const handleUpdateSuccess = (updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    message.success("Cập nhật thông tin thành công!");
  };

  return (
    <Wrapper>
      <Button
        type="link"
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 90,
          left: 10,
          fontSize: "30px",
        }}
      >
        ←
      </Button>

      <h1>Thông tin cá nhân</h1>

      <UserInfo>
        <Avatar
          size={80}
          key={user.avatar}
          src={`http://localhost/WebsiteTraSua/uploads/avatars/${
            user.avatar
          }?t=${Date.now()}`}
        />
        <div className="info-text">
          <p style={{ marginBottom: 4 }}>
            <strong>{user.name}</strong>
          </p>
          <p>{user.email}</p>
          <p>{user.diachi}</p>
        </div>
      </UserInfo>

      <Tabs defaultActiveKey="1" type="card" tabPosition="top">
        <Tabs.TabPane tab="Cập nhật thông tin" key="1">
          <AccountUpdateForm user={user} onSuccess={handleUpdateSuccess} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đơn hàng đã mua" key="2">
          <OrdersPage />
        </Tabs.TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default ProfilePage;
