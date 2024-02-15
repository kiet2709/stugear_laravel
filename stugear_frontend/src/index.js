import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { AuthProvider } from "./context/AuthProvider";
import "aos/dist/aos.css";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PaymentProvider } from "./context/PaymentProvider";
import { ProductProvider } from "./context/ProductProvider";
import "./utils/Fontawesome.js"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <BrowserRouter>
    <GoogleOAuthProvider clientId="1043189901162-7csr13i8ku1dvcrsa7i08756qp6eb13m.apps.googleusercontent.com">
      <PaymentProvider>
        <ProductProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ProductProvider>
      </PaymentProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
