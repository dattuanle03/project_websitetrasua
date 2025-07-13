import React from "react";
import ProductList from "./components/ProductList/ProductList";
import SliderComponent from "./components/SliderComponent/SliderComponent";

const HomePage = ({ searchTerm }) => {
  return (
    <div style={{ paddingTop: "69px" }}>
      {/* ❌ XÓA: <HeaderComponent onSearch={setSearchTerm} /> */}

      <SliderComponent />
      <div>
        <h1
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#ff69b4",
            margin: "50px 0",
            textTransform: "uppercase",
            letterSpacing: "1px",
            display: "inline-block",
            paddingBottom: "10px",
            marginLeft: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Sản phẩm
        </h1>
        <div id="section_product">
          {/* ✅ truyền searchTerm vào ProductList */}
          <ProductList searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
