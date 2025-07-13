import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const removeVietnameseTones = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const ProductList = ({ searchTerm = "" }) => {
  const [sanpham, setSanpham] = useState([]);
  const [avgRatings, setAvgRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const navigate = useNavigate();

  // Gọi API sản phẩm và điểm đánh giá trung bình
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost/WebsiteTraSua/frontend_trasua/src/api/list_product.php"
        );
        const products = res.data;
        setSanpham(products);

        // Gọi đánh giá trung bình từng sản phẩm
        const ratingResults = await Promise.all(
          products.map((sp) =>
            axios
              .get(
                `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_avg_rating.php?id_sanpham=${sp.id_sanpham}`
              )
              .then((res) => ({ id: sp.id_sanpham, avg: res.data.avg_rating }))
              .catch(() => ({ id: sp.id_sanpham, avg: null }))
          )
        );

        // Chuyển kết quả về object map
        const ratingsMap = {};
        ratingResults.forEach((r) => {
          ratingsMap[r.id] = r.avg;
        });
        setAvgRatings(ratingsMap);
      } catch (err) {
        console.error("Lỗi gọi API:", err);
      }
    };

    fetchProducts();
  }, []);

  // Reset page khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredProducts = sanpham.filter((sp) => {
    if (!searchTerm) return true;

    const keywords = removeVietnameseTones(searchTerm.toLowerCase()).split(" ");
    const wordsInName = removeVietnameseTones(
      sp.tensanpham?.toLowerCase()
    ).split(" ");
    return keywords.every((kw) =>
      wordsInName.some((word) => word.includes(kw))
    );
  });

  const start = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(start, start + pageSize);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {paginatedProducts.map((sp) => (
          <Col key={sp.id_sanpham} xs={12} sm={12} md={8} lg={6} xl={6}>
            <div
              className="product-card"
              onClick={() => navigate(`/sanpham/${sp.id_sanpham}`)}
            >
              {/* ⭐ Rating góc trên phải */}
              {avgRatings[sp.id_sanpham] > 0 && (
                <div className="rating-badge">
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

      {filteredProducts.length > pageSize && (
        <div className="pagination-wrapper">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProducts.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
