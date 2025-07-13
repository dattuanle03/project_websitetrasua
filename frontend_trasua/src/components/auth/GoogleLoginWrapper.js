// GoogleLoginWrapper.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginWrapper = ({ onSuccess, onError }) => {
  return <GoogleLogin onSuccess={onSuccess} onError={onError} />;
};

export default GoogleLoginWrapper;
