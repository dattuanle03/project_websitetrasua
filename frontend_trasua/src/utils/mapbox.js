// src/utils/mapbox.js
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const mapboxToken =
  "pk.eyJ1IjoiaGlldWx2MDMiLCJhIjoiY21jc3RqYjF4MDJ3ZzJsb3A3b2h5eDJuYiJ9.itIBMH0-XXQszuNq7Fm90w";

const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

export const shopLocation = {
  lat: 10.738016,
  lng: 106.677574,
};

export const getCoordinates = async (address) => {
  const response = await geocodingClient
    .forwardGeocode({
      query: address,
      limit: 1,
    })
    .send();

  const match = response.body.features[0];
  if (!match) throw new Error("Không tìm thấy tọa độ từ địa chỉ");

  return {
    lat: match.center[1],
    lng: match.center[0],
  };
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
