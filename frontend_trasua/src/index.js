import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { ModalProvider } from "./contexts/ModalContext";
import { CartProvider } from "./contexts/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <ModalProvider>
      <CartProvider>
        <GoogleOAuthProvider clientId="776938330965-gqq39jdpv7gj5u22ijaiq4pbdisd4p2b.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </CartProvider>
    </ModalProvider>
  </UserProvider>
);
