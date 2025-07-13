import React, { useState } from "react";

const CategoryAddPage = () => {
  const [tendanhmuc, setTendanhmuc] = useState("");
  const [slug, setSlug] = useState(""); // ✅ Sửa lỗi tại đây

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "http://localhost/WebsiteTraSua/admin/src/api/category_add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tendanhmuc, slug }), // ✅ ĐÂY LÀ DÒNG NÀY
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Thêm thành công");
        setTendanhmuc("");
        setSlug("");
      } else {
        alert("Thêm thất bại: " + data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <div>
      <h2>Thêm danh mục</h2>
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
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default CategoryAddPage;
