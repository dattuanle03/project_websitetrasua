import React, { useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AccountUpdateForm = ({ user, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = ({ file, fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("id", user.id);

    if (values.password) formData.append("password", values.password);
    if (values.diachi) formData.append("diachi", values.diachi);
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost/WebsiteTraSua/frontend_trasua/src/api/update_profile.php",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        message.success("Cập nhật thành công");
        onSuccess(response.data.user);
        form.resetFields();
        setFileList([]); // reset ảnh đã chọn
      } else {
        message.error(response.data.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi cập nhật tài khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ diachi: user.diachi || "" }}
    >
      <Form.Item label="Ảnh đại diện">
        <Upload
          listType="picture"
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleAvatarChange}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>

      <Form.Item name="diachi" label="Địa chỉ">
        <Input placeholder="Nhập địa chỉ" />
      </Form.Item>

      <Form.Item name="password" label="Mật khẩu mới">
        <Input.Password placeholder="Để trống nếu không đổi" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountUpdateForm;
