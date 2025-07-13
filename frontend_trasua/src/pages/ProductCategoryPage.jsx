import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Pagination } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "../../src/components/ProductList/ProductList.css";

const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const ProductCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const navigate = useNavigate();
  const { slug } = useParams(); // lấy slug từ URL, ví dụ "trasua"

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost/WebsiteTraSua/frontend_trasua/src/api/category.php?slug=${slug}`
        );
        if (!Array.isArray(res.data)) {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
          return;
        }

        setProducts(res.data);

        // gọi rating cho từng sản phẩm
        const ratingPromises = res.data.map((sp) =>
          axios
            .get(
              `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_avg_rating.php?id_sanpham=${sp.id_sanpham}`
            )
            .then((res) => ({ id: sp.id_sanpham, avg: res.data.avg_rating }))
            .catch(() => ({ id: sp.id_sanpham, avg: null }))
        );

        const ratingResults = await Promise.all(ratingPromises);
        const ratingsMap = {};
        ratingResults.forEach((r) => {
          ratingsMap[r.id] = r.avg;
        });
        setAvgRatings(ratingsMap);
      } catch (err) {
        console.error("❌ Lỗi gọi API:", err);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProducts = products.slice(start, end);

  return (
    <div style={{ padding: "90px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Danh mục: {slug}
      </h2>

      <Row gutter={[16, 16]}>
        {paginatedProducts.map((sp) => (
          <Col key={sp.id_sanpham} span={6}>
            <div
              className="product-card"
              onClick={() => navigate(`/sanpham/${sp.id_sanpham}`)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              {avgRatings[sp.id_sanpham] > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "#fffbe6",
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "#faad14",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    zIndex: 2,
                  }}
                >
                  ⭐ {avgRatings[sp.id_sanpham]}
                </div>
              )}

              <img
                src={`http://localhost/WebsiteTraSua/uploads/products/${sp.hinhanh}`}
                alt={sp.tensanpham}
                className="product-image"
              />
              <h3>{sp.tensanpham}</h3>
              <p>Giá: {Number(sp.giasp).toLocaleString()}₫</p>
              <div className="view-detail">Nhấp để xem chi tiết</div>
            </div>
          </Col>
        ))}
      </Row>

      {products.length > pageSize && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        >
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={products.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCategoryPage;
