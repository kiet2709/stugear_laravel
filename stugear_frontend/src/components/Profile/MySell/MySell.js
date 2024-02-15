import { useEffect, useState } from "react";
import UserService from "../../../service/UserService";
import "./MySell.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../Loading";
import useProduct from "../../../hooks/useProduct";
const MySell = () => {
  const {productCount, setProductCount} = useProduct()
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const getOrders = async () => {
    setLoading(true);
    const response = await UserService.getCurrentUserOrders();
    
    
    let orderCount = response?.total_items;
    localStorage.setItem("order", parseInt(orderCount))
    setProductCount({
      ...productCount,
      myOrder: orderCount,
    });
 
    console.log(response);
    if (response?.status !== 400) {
      setOrders(response?.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getOrders();
  }, []);

  const hanldeViewDetail = (e, orderId) => {
    e.preventDefault();
    navigate(`/member/order-detail/${orderId}`);
  };
  return (
    <>
      <div>
        {isLoading ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            {orders?.length == 0 ? (
              <>
                <p className="my-1 text-center">
                  Không có đơn hàng nào đang bán
                </p>
                <hr className="bg-dark" />
              </>
            ) : (
              <>
                <table className="order-table table table-bordered">
                  <thead style={{ background: "#7355F7" }}>
                    <tr>
                      <th
                        className="text-white"
                        style={{ background: "#7355F7" }}
                        scope="col"
                      >
                        ID
                      </th>
                      <th
                        className="text-white"
                        style={{ background: "#7355F7" }}
                        scope="col"
                      >
                        Sản phẩm
                      </th>
                      <th
                        className="text-white"
                        style={{ background: "#7355F7" }}
                        scope="col"
                      >
                        Trạng thái
                      </th>
                      <th
                        className="text-white"
                        style={{ background: "#7355F7" }}
                        scope="col"
                      >
                        Ngày tạo
                      </th>
                      <th
                        className="text-white"
                        style={{ background: "#7355F7" }}
                        scope="col"
                      >
                        Chi tiết
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((item) => {
                      return (
                        <tr>
                          <td>{item?.id}</td>
                          <td>{item?.product_title}</td>
                          <td>{item?.status}</td>
                          <td>{item?.created_date}</td>
                          <td>
                            <button
                              className="btn"
                              onClick={(e) => hanldeViewDetail(e, item?.id)}
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MySell;
