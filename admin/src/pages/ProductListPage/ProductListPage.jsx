import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../../api/productApi";
import { useNavigate } from "react-router-dom";
import "./ProductListPage.css";

const ProductListPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // ✅ Thêm state cho tìm kiếm
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");

  const getList = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD") // chuẩn hóa
      .replace(/[\u0300-\u036f]/g, "") // xoá dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
      try {
        const res = await deleteProduct(id);
        if (res.success) {
          alert("Đã xoá sản phẩm.");
          getList();
        } else {
          alert("Xoá thất bại!");
        }
      } catch (err) {
        alert("Lỗi khi xoá sản phẩm.");
      }
    }
  };

  // ✅ Lọc sản phẩm theo ID và tên trước khi phân trang
  const filteredProducts = products.filter((sp) => {
    const matchId =
      !searchId || sp.id_sanpham.toString().includes(searchId.trim());

    const matchName =
      !searchName ||
      removeVietnameseTones(sp.tensanpham.toLowerCase()).includes(
        removeVietnameseTones(searchName.trim().toLowerCase())
      );

    return matchId && matchName;
  });

  // ✅ Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="product-list">
      <h2 className="product-list__title">Danh sách sản phẩm</h2>

      {/* ✅ Ô tìm kiếm */}
      <div className="product-list__search">
        <input
          type="text"
          placeholder="Tìm theo ID sản phẩm"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setCurrentPage(1); // reset về trang 1 khi tìm kiếm
          }}
        />
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table className="product-list__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Hình ảnh</th>
            <th>Tóm tắt</th>
            <th>Tình trạng</th>
            <th>ID Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((sp) => (
            <tr key={sp.id_sanpham}>
              <td>{sp.id_sanpham}</td>
              <td>{sp.tensanpham}</td>
              <td>{sp.giasp} đ</td>
              <td>
                <img
                  src={`http://localhost/WebsiteTraSua/uploads/products/${sp.hinhanh}`}
                  alt={sp.tensanpham}
                  className="product-list__image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "http://localhost/WebsiteTraSua/uploads/products/no-image.png";
                  }}
                />
              </td>
              <td>{sp.tomtat}</td>
              <td>
                {sp.tinhtrang === "1" || sp.tinhtrang === 1
                  ? "Kích hoạt"
                  : "Ẩn"}
              </td>
              <td>{sp.id_danhmuc}</td>
              <td>
                <button
                  className="product-list__button product-list__button--delete"
                  onClick={() => handleDelete(sp.id_sanpham)}
                >
                  Xoá
                </button>
                <button
                  className="product-list__button product-list__button--edit"
                  onClick={() => navigate(`/products/edit/${sp.id_sanpham}`)}
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
