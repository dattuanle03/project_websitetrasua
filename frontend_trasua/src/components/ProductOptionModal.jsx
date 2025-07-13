// src/components/ProductOptionModal.jsx
import React, { useState } from "react";
import { Modal, Radio } from "antd";
const styles = {
  label: {
    display: "block",
    marginBottom: 6,
    fontWeight: 600,
    color: "#333",
    fontSize: 15,
  },
  group: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 8,
  },
};

const ProductOptionModal = ({
  visible,
  onCancel,
  onConfirm,
  product,
  confirmText = "Xác nhận",
}) => {
  const [size, setSize] = useState("M");
  const [ice, setIce] = useState("Nhiều đá");
  const [sugar, setSugar] = useState("100%");

  const handleOk = () => {
    const basePrice = Number(product.gia || product.giasp || 0);
    const priceWithSize = size === "L" ? basePrice + 5000 : basePrice;

    const selectedProduct = {
      ...product,
      giasp: priceWithSize,
      size,
      ice,
      sugar,
      quantity: 1,
    };

    onConfirm(selectedProduct); // truyền về component cha
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 18, fontWeight: "bold" }}>
          Chọn tuỳ chọn sản phẩm
        </span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={confirmText}
      cancelText="Hủy"
      centered
    >
      <div style={styles.modalBody}>
        <div>
          <label style={styles.label}>Chọn size:</label>
          <div style={styles.group}>
            <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
              <Radio.Button value="M">Size M</Radio.Button>
              <Radio.Button value="L">Size L (+5.000₫)</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div>
          <label style={styles.label}>Chọn đá:</label>
          <div style={styles.group}>
            <Radio.Group value={ice} onChange={(e) => setIce(e.target.value)}>
              <Radio.Button value="Ít đá">Ít đá</Radio.Button>
              <Radio.Button value="Nhiều đá">Nhiều đá</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div>
          <label style={styles.label}>Chọn đường:</label>
          <div style={styles.group}>
            <Radio.Group
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
            >
              <Radio.Button value="50%">50%</Radio.Button>
              <Radio.Button value="70%">70%</Radio.Button>
              <Radio.Button value="100%">100%</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductOptionModal;
