import React, { useState, useEffect } from "react";
import "./ProductAddPage.css";

const ProductAddPage = () => {
  const [formData, setFormData] = useState({
    tensanpham: "",
    giasp: "",
    hinhanh: null,
    tomtat: "",
    tinhtrang: "1",
    id_danhmuc: "",
  });

  const [categories, setCategories] = useState([]); // Lưu danh mục

  useEffect(() => {
    // Lấy danh mục từ API (đổi URL cho đúng với API của bạn)
    fetch("http://localhost/WebsiteTraSua/admin/src/api/category_list.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
        else alert("Lỗi tải danh mục: " + data.message);
      })
      .catch(() => alert("Lỗi kết nối server khi tải danh mục"));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "hinhanh") {
      setFormData({ ...formData, hinhanh: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra giá
    const gia = Number(formData.giasp);
    if (isNaN(gia) || gia <= 0) {
      alert("Giá sản phẩm phải là số dương lớn hơn 0.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(
        "http://localhost/WebsiteTraSua/admin/src/api/product_add.php",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Thêm sản phẩm thành công!");
        setFormData({
          tensanpham: "",
          giasp: "",
          hinhanh: null,
          tomtat: "",
          tinhtrang: "1",
          id_danhmuc: "",
        });
      } else {
        alert("Thêm thất bại: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className="product-add-container">
      <h2>Thêm sản phẩm</h2>
      <form
        className="product-add-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div>
          <label>Tên sản phẩm:</label>
          <input
            type="text"
            name="tensanpham"
            value={formData.tensanpham}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Giá:</label>
          <input
            type="number"
            name="giasp"
            value={formData.giasp}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hình ảnh:</label>
          <input
            type="file"
            name="hinhanh"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tóm tắt:</label>
          <textarea
            name="tomtat"
            value={formData.tomtat}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label>Tình trạng:</label>
          <select
            name="tinhtrang"
            value={formData.tinhtrang}
            onChange={handleChange}
            required
          >
            <option value="1">Còn hàng</option>
            <option value="0">Hết hàng</option>
          </select>
        </div>
        <div>
          <label>Danh mục sản phẩm:</label>
          <select
            name="id_danhmuc"
            value={formData.id_danhmuc}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id_danhmuc} value={cat.id_danhmuc}>
                {cat.tendanhmuc}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default ProductAddPage;
