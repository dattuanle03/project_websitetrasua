import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../ProductAddPage/ProductAddPage.css";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tensanpham: "",
    giasp: "",
    hinhanh: null,
    tomtat: "",
    tinhtrang: "1",
    id_danhmuc: "",
  });
  const [categories, setCategories] = useState([]); // <-- Thêm state danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [oldImage, setOldImage] = useState("");

  // Lấy danh mục khi component mount
  useEffect(() => {
    fetch("http://localhost/WebsiteTraSua/admin/src/api/category_list.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
        else alert("Lỗi tải danh mục: " + data.message);
      })
      .catch(() => alert("Lỗi kết nối server khi tải danh mục"));
  }, []);

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost/WebsiteTraSua/admin/src/api/product_detail.php?id=${id}`
        );
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setFormData({
            tensanpham: p.tensanpham || "",
            giasp: p.giasp || "",
            hinhanh: null,
            tomtat: p.tomtat || "",
            tinhtrang: p.tinhtrang || "1",
            id_danhmuc: p.id_danhmuc || "",
          });
          setOldImage(p.hinhanh);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err) {
        console.error(err);
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
    const data = new FormData();
    data.append("id", id);
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "hinhanh" && value === null) return;
      data.append(key, value);
    });
    data.append("hinhanh_cu", oldImage || "");

    try {
      const response = await fetch(
        "http://localhost/WebsiteTraSua/admin/src/api/product_update.php",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Cập nhật sản phẩm thành công!");
        navigate("/products");
      } else {
        alert("Cập nhật thất bại: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-add-container">
      <h2>Sửa sản phẩm</h2>
      <form
        onSubmit={handleSubmit}
        className="product-add-form"
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
          <label>Hình ảnh cũ:</label>
          {oldImage && (
            <div style={{ marginBottom: "8px" }}>
              <img
                src={`http://localhost/WebsiteTraSua/uploads/products/${oldImage}`}
                alt="Hình cũ"
                style={{ maxWidth: "150px", borderRadius: "8px" }}
              />
            </div>
          )}
          <input
            type="file"
            name="hinhanh"
            accept="image/*"
            onChange={handleChange}
          />
          <small>Bỏ qua nếu không muốn thay đổi hình</small>
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
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default ProductEditPage;
