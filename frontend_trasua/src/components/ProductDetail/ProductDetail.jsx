import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { Button, message, Modal, Rate } from "antd";
import { ModalContext } from "../../contexts/ModalContext";
import { CartContext } from "../../contexts/CartContext";
import ProductOptionModal from "../../components/ProductOptionModal";

const DetailWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  margin: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    margin: 60px 0px;
  }
`;

const Image = styled.img`
  width: 320px;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

const BackButton = styled(Button)`
  font-size: 30px;
  position: absolute;
  z-index: 10;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: blue;

  @media (max-width: 768px) {
    font-size: 24px;
    top: 10px;
    left: 10px;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h2 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 22px;
    }
  }

  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  .price {
    font-size: 24px;
    color: #e53935;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  .button-group {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    button {
      border-radius: 6px;
      height: 40px;
      font-size: 16px;
      padding: 0 20px;
      transition: all 0.3s ease;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
`;

const ReviewsSection = styled.div`
  margin: 40px 100px;
  padding: 30px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    margin: 20px;
    padding: 20px;
  }

  h3 {
    font-size: 22px;
    color: #333;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  .review {
    border-bottom: 1px solid #eee;
    padding: 16px 0;
    font-size: 15px;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    strong {
      color: #333;
    }

    img {
      margin-top: 8px;
      max-width: 250px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        max-width: 100%;
      }
    }
  }

  textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 12px;
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;
const DeleteButton = styled(Button)`
  background-color: #ff4d4f !important;
  color: #fff !important;
  font-weight: bold;
  border-radius: 6px;
  margin-top: 8px;

  &:hover {
    background-color: #ff7875 !important;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { addToCart } = useContext(CartContext);
  const { setShowModal } = useContext(ModalContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [optionMode, setOptionMode] = useState("cart"); // "cart" hoặc "buy"

  // Lấy sản phẩm + đánh giá + rating trung bình
  useEffect(() => {
    axios
      .get(
        `http://localhost/WebsiteTraSua/frontend_trasua/src/api/product_detail.php?id=${id}`
      )
      .then((res) => setProduct(res.data))
      .catch(() => message.error("Không thể tải sản phẩm."));

    axios
      .get(
        `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_reviews.php?id_sanpham=${id}`
      )
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setReviews(data);
      })
      .catch(() => setReviews([]));

    axios
      .get(
        `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_avg_rating.php?id_sanpham=${id}`
      )
      .then((res) => {
        const avg = parseFloat(res.data.avg_rating);
        setAvgRating(!isNaN(avg) && avg > 0 ? avg.toFixed(1) : null);
      })
      .catch(() => setAvgRating(null));
  }, [id]);

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    setOptionMode("cart");
    setOptionModalVisible(true);
  };

  // -------------------------------------------
  // Mua ngay: mở modal chọn size, đá, đường
  const handleBuyNow = () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để tiếp tục mua hàng!");
      setShowModal(true);
      return;
    }
    setOptionMode("buy");
    setOptionModalVisible(true);
  };

  const handleOptionConfirm = (selectedProduct) => {
    if (optionMode === "cart") {
      addToCart(selectedProduct);
      message.success("Đã thêm vào giỏ hàng!");
    } else {
      localStorage.setItem("checkoutItems", JSON.stringify([selectedProduct]));
      navigate("/cart");
    }
    setOptionModalVisible(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);

  // trong form đánh giá:
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setSelectedImage(e.target.files[0])}
  />;
  const [imageFile, setImageFile] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);

  const handleSubmitReview = () => {
    if (!user) {
      message.warning("Bạn cần đăng nhập để đánh giá.");
      return;
    }

    const formData = new FormData();
    formData.append("id_sanpham", id);
    formData.append("id_khachhang", user.id);
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (imageFile) {
      formData.append("hinhanh", imageFile);
    }
    setLoadingReview(true);
    axios
      .post(
        "http://localhost/WebsiteTraSua/frontend_trasua/src/api/create_review.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .finally(() => setLoadingReview(false))
      .then((res) => {
        if (res.data.success) {
          message.success("Cảm ơn bạn đã đánh giá!");
          setComment("");
          setRating(5);
          setImageFile(null);

          return axios.get(
            `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_reviews.php?id_sanpham=${id}`
          );
        } else {
          throw new Error(res.data.message || "Không thành công");
        }
      })

      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => message.error("Không thể gửi hoặc tải lại đánh giá."));
  };
  const handleDeleteReview = (reviewId) => {
    Modal.confirm({
      title: "Xác nhận xóa bình luận?",
      content: "Bạn chắc chắn muốn xóa đánh giá này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        axios
          .post(
            "http://localhost/WebsiteTraSua/frontend_trasua/src/api/delete_review.php",
            {
              id_review: reviewId,
              id_khachhang: user.id,
            }
          )
          .then((res) => {
            if (res.data.success) {
              message.success("Đã xóa bình luận.");
              return axios.get(
                `http://localhost/WebsiteTraSua/frontend_trasua/src/api/get_reviews.php?id_sanpham=${id}`
              );
            } else {
              throw new Error(res.data.message);
            }
          })
          .then((res) => {
            setReviews(Array.isArray(res.data) ? res.data : []);
          })
          .catch(() => message.error("Không thể xóa bình luận."));
      },
    });
  };
  if (!product) return <p>Đang tải...</p>;

  return (
    <div style={{ position: "relative" }}>
      <ProductOptionModal
        visible={optionModalVisible}
        onCancel={() => setOptionModalVisible(false)}
        onConfirm={handleOptionConfirm}
        product={product}
        confirmText={optionMode === "cart" ? "Thêm vào giỏ" : "Mua ngay"}
      />

      <BackButton onClick={() => navigate(-1)}>←</BackButton>

      <DetailWrapper>
        <Image
          src={`http://localhost/WebsiteTraSua/uploads/products/${product.hinhanh}`}
          alt={product.tensanpham}
        />
        <Info>
          <h2>{product.tensanpham}</h2>
          {avgRating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Rate
                disabled
                value={parseFloat(avgRating)}
                allowHalf
                style={{ fontSize: 18 }}
              />
              <span
                style={{ marginLeft: 8, color: "#faad14", fontWeight: 500 }}
              >
                {avgRating} sao
              </span>
            </div>
          )}
          <p className="price">{Number(product.giasp).toLocaleString()}₫</p>
          <p>
            <strong>Mô tả:</strong> {product.tomtat}
          </p>
          <div className="button-group">
            <Button
              type="primary"
              onClick={handleAddToCart}
              style={{ marginRight: 10 }}
            >
              Thêm vào giỏ
            </Button>
            <Button type="default" danger onClick={handleBuyNow}>
              Mua ngay
            </Button>
          </div>
        </Info>
      </DetailWrapper>

      <ReviewsSection>
        <h3>Đánh giá sản phẩm</h3>
        {reviews.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          <>
            {reviews.slice(0, showAllReviews ? reviews.length : 4).map((r) => (
              <div key={r.id} className="review">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {r.avatar ? (
                    <img
                      src={`http://localhost/WebsiteTraSua/uploads/avatars/${r.avatar}`}
                      alt="avatar"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      {r.tenkhachhang?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <strong>{r.tenkhachhang}</strong> –{" "}
                    {new Date(r.created_at).toLocaleString()}
                    <br />
                    <Rate disabled value={r.rating} />
                  </div>
                </div>
                <p style={{ marginLeft: 50 }}>{r.comment}</p>
                {r.hinhanh && (
                  <img
                    src={`http://localhost/WebsiteTraSua/uploads/reviews/${r.hinhanh}`}
                    alt="Ảnh đánh giá"
                    style={{
                      marginLeft: 50,
                      maxWidth: "300px",
                      borderRadius: 8,
                    }}
                  />
                )}
                {user && parseInt(user.id) === parseInt(r.id_khachhang) && (
                  <Button
                    danger
                    size="small"
                    onClick={() => handleDeleteReview(r.id)}
                    style={{ marginLeft: 50, marginTop: 8 }}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            ))}

            {reviews.length > 4 && !showAllReviews && (
              <Button
                type="link"
                onClick={() => setShowAllReviews(true)}
                style={{ marginTop: 10 }}
              >
                Xem tất cả bình luận
              </Button>
            )}
            {reviews.length > 4 && showAllReviews && (
              <Button
                type="link"
                onClick={() => setShowAllReviews(false)}
                style={{ marginTop: 10 }}
              >
                Thu gọn bình luận
              </Button>
            )}
          </>
        )}

        {/* FORM GỬI BÌNH LUẬN */}
        {user && (
          <div style={{ marginTop: 30 }}>
            <h4>Viết đánh giá của bạn</h4>
            <Rate value={rating} onChange={(value) => setRating(value)} />
            <textarea
              placeholder="Nhập bình luận..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{ marginTop: 10 }}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                style={{
                  maxWidth: "150px",
                  marginTop: 10,
                  borderRadius: 8,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
            )}
            <Button
              type="primary"
              loading={loadingReview}
              onClick={handleSubmitReview}
              disabled={!comment.trim()}
              style={{ marginTop: 10 }}
            >
              Gửi đánh giá
            </Button>
          </div>
        )}
      </ReviewsSection>
    </div>
  );
};

export default ProductDetail;
