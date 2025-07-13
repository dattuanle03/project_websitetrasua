import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const CategoryEditPage = () => {
  const { id } = useParams();
  const [tendanhmuc, setTendanhmuc] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost/WebsiteTraSua/admin/src/api/category_detail.php?id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTendanhmuc(data.tendanhmuc);
        setSlug(data.slug);
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/WebsiteTraSua/admin/src/api/category_edit.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, tendanhmuc, slug }),
        }
      );
      const data = await res.json();
      if (data.success) alert("Cập nhật thành công");
      else alert("Cập nhật thất bại: " + data.message);
    } catch (err) {
      alert("Lỗi khi cập nhật");
    }
  };

  return (
    <AdminLayout>
      <h2>Chỉnh sửa danh mục</h2>
      <form onSubmit={handleSubmit}>
        <label>Tên danh mục:</label>
        <input
          type="text"
          value={tendanhmuc}
          onChange={(e) => setTendanhmuc(e.target.value)}
          required
        />
        <label>Slug:</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <button type="submit">Cập nhật</button>
      </form>
    </AdminLayout>
  );
};

export default CategoryEditPage;
