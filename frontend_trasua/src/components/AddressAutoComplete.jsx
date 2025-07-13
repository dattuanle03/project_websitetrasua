import React, { useState } from "react";
import { AutoComplete, message } from "antd";
import {
  getCoordinates,
  calculateDistance,
  shopLocation,
} from "../utils/mapbox";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGlldWx2MDMiLCJhIjoiY21jc3RqYjF4MDJ3ZzJsb3A3b2h5eDJuYiJ9.itIBMH0-XXQszuNq7Fm90w";

const AddressAutoComplete = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);

  const handleSearch = async (query) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5&language=vi&country=vn&proximity=${
          shopLocation.lng
        },${shopLocation.lat}`
      );
      const data = await res.json();
      const results =
        data.features
          ?.filter(
            (place) =>
              place.place_name.includes("Việt Nam") ||
              place.context?.some((c) => c.text_vi === "Việt Nam")
          )
          .map((place) => ({
            value: place.place_name,
          })) || [];

      setOptions(results);
    } catch (err) {
      console.error("❌ Lỗi Mapbox autocomplete:", err);
    }
  };

  const handleSelect = async (address) => {
    onChange({
      target: {
        name: "address",
        value: address,
      },
    });

    try {
      const location = await getCoordinates(address);
      const distance = calculateDistance(
        shopLocation.lat,
        shopLocation.lng,
        location.lat,
        location.lng
      );

      console.log(`📏 Khoảng cách tự động: ${distance.toFixed(2)} km`);

      // ❌ Không thông báo ở đây nữa
    } catch (err) {
      console.error("❌ Lỗi khi xác định vị trí:", err);
      message.error("Không xác định được vị trí từ địa chỉ.");
    }
  };

  return (
    <AutoComplete
      style={{ width: "100%", marginBottom: "24px" }}
      options={options}
      value={value}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={(val) => onChange({ target: { name: "address", value: val } })}
      placeholder="Nhập địa chỉ nhận hàng (VD: Ấp 3, Xã Bình Hưng, Huyện Bình Chánh...)"
    />
  );
};

export default AddressAutoComplete;
