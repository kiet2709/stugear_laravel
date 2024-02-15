import "./index.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import Loading from "../Loading/index"
import UserService from "../../service/UserService";
import useProduct from "../../hooks/useProduct";

const OauthSection = ({ text }) => {
  const {productCount, setProductCount} = useProduct()
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false)
  const [isError, setError] = useState("")
  const { setUser } = useAuth();
  const handleOauthResponse = (jwtResponse) => {
    setError("")
    const userInfo = jwtDecode(jwtResponse.credential);
    handleCreateAccount({
      name: userInfo?.name,
      email: userInfo?.email,
      firstName: userInfo?.family_name,
      lastName: userInfo?.given_name,
      password: "password",
      confirmPassword: "password",
    });
  };

  const getUserInfo = async () => {
    let wishlistCount = 0;
    let orderCount = 0;
    let productCount = 0;
    const wishlistResponse = await UserService.getCurrentUserWishlist();
    if (wishlistResponse?.status != 400) {
      wishlistCount = wishlistResponse?.length;
      localStorage.setItem("wishlist", wishlistCount)
    }

    const orderResponse = await UserService.getCurrentUserOrders();
    if (orderResponse?.status != 400) {
      orderCount = orderResponse?.total_items;
      localStorage.setItem("order", orderCount)
    }

    const productResponse = await UserService.getCurrentUserProducts();
    if (productResponse?.status != 400) {
      productCount = productResponse?.total_items;
      localStorage.setItem("product", productCount)
    }

    setProductCount({
      ...productCount,
      wishlist: wishlistCount,
      myProduct: productCount,
      myOrder: orderCount,
    });
  };
  const handleCreateAccount = async (oauthUser) => {
    setLoading(true)
    await AuthService.register(oauthUser);

    let response = await AuthService.login(oauthUser);
    if(response.status === 401){
      setError("Email này đã được đăng ký")
      setLoading(false)
      return
    }
    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;
    const userId = response.user_id;
    const username = response.username;
    const roles = response.roles;

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", roles);
    const balanceResponse = await UserService.getCurrentUserBalance();
    if (balanceResponse.status !== 400) {
      localStorage.setItem("balance", balanceResponse.balance);
    }
    response = { ...response, balance: balanceResponse.balance };
    setUser(response);
    localStorage.setItem(
      "user_image",
      `http://localhost:8000/api/users/${response?.user_id}/images`
    );
    setUser({
      ...response,
      user_image: `http://localhost:8000/api/users/${response?.user_id}/images`,
    });

    await getUserInfo()
    setLoading(false)

    if (roles.includes("ADMIN")) {
      navigate("/admin");
    } else {
      navigate("/landing-page");
    }
  };

  return (
    <>
    {isError ? (
          <>
            <div className="alert alert-danger my-4 text-center">{isError}</div>
          </>
        ) :
      (
        <></>
      )}
         <div className="social mt-4 " style={{marginLeft:'60px', marginRight:'35px'}} >
      {isLoading ? (
        <>

          <Loading/>
        </>
      ): (
        <GoogleLogin
        
        onSuccess={(credentialResponse) => {
          handleOauthResponse(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      )}
       
     
    </div>
    </>
 
  );
};

export default OauthSection;
