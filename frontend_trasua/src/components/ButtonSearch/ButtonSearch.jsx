import React, { useState } from "react";
import { Input } from "antd";

const ButtonSearch = ({ placeholder, textButton, size, onSearch }) => {
  const [value, setValue] = useState("");

  return (
    <Input.Search
      value={value}
      placeholder={placeholder}
      enterButton={textButton}
      size={size}
      onChange={(e) => setValue(e.target.value)}
      onSearch={(value) => onSearch && onSearch(value)}
      allowClear
    />
  );
};

export default ButtonSearch;
