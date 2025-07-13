import axios from "axios";

const API_BASE = "http://localhost/WebsiteTraSua/admin/src/api";

// Lấy danh sách
export const fetchProducts = async (page = 1) => {
  const res = await axios.get(`${API_BASE}/product_list.php?page=${page}`);
  return res.data.products || [];
};

// Thêm
export const addProduct = async (formData) => {
  const res = await axios.post(`${API_BASE}/product_add.php`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Sửa
export const updateProduct = async (id, formData) => {
  const res = await axios.post(
    `${API_BASE}/product_update.php?id=${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};

// Xoá
export const deleteProduct = async (id) => {
  const res = await axios.get(`${API_BASE}/product_delete.php?id=${id}`);
  return res.data;
};
