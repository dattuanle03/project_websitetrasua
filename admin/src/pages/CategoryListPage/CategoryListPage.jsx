import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost/WebsiteTraSua/admin/src/api/category_list.php"
      );
      const data = await res.json();
      setCategories(data.categories || []); // Lấy đúng mảng categories
    } catch (err) {
      console.error("Lỗi tải danh mục:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá danh mục này không?")) {
      try {
        const res = await fetch(
          `http://localhost/WebsiteTraSua/admin/src/api/category_delete.php?id=${id}`
        );
        const data = await res.json();
        if (data.success) {
          alert("Đã xoá danh mục.");
          fetchCategories();
        } else {
          alert("Không thể xoá: " + data.message); // 👈 hiện lỗi chi tiết
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ.");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Danh sách danh mục</h2>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Slug</th>

            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((dm) => (
            <tr key={dm.id_danhmuc}>
              <td>{dm.id_danhmuc}</td>
              <td>{dm.tendanhmuc}</td>
              <td>{dm.slug}</td>

              <td>
                <button onClick={() => handleDelete(dm.id_danhmuc)}>Xoá</button>
                <button
                  onClick={() => navigate(`/categories/edit/${dm.id_danhmuc}`)}
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryListPage;
