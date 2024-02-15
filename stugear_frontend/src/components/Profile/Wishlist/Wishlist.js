import "./Wishlist.css";
import WishlistItem from "./WishlistItem";
import { useEffect, useState } from "react";
import UserService from "../../../service/UserService";
import Loading from "../../Loading";
import useProduct from "../../../hooks/useProduct";
const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const {productCount, setProductCount} = useProduct()
  const [isLoading, setLoading] = useState(true);
  const [key, setKey] = useState(0)
  const getWishlitCurrentUser = async () => {
    setLoading(true);
    const wishlistResponse = await UserService.getCurrentUserWishlist();
    if (wishlistResponse?.status != 400) {
      let wishlistCount = wishlistResponse?.length;
      localStorage.setItem("wishlist", wishlistCount)
      setProductCount({
        ...productCount,
        wishlist: wishlistCount,
      });
    }
    const response = await UserService.getCurrentUserWishlist();
    if (response == 500) {
      console.log("Something went wrong");
      
    } else {
      setWishlists(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    
    getWishlitCurrentUser();
  }, [key]);

  return (
    <>
      <div>
        <div className="table-responsive wishlist-table margin-bottom-none">
          <table className="table">
            <tbody>
              
              {isLoading ? (
                <Loading />
              ) : wishlists?.length === 0 ? (
                <tr className="text-center">
                  <td>Không có sản phẩm nào trong mục yêu thích</td>
                </tr>
              ) :  (
                <>
                  {wishlists?.map((item) => (
                    <WishlistItem key={item?.id} item={item} setKey={setKey}/>
                  ))}
                </>
              )}
            </tbody>
          </table>  
        </div>
      </div>
    </>
  );
};

export default Wishlist;
