import { useEffect, useState } from "react";
import "./MyOrder.css";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../../service/UserService";
import CustomPagination from "../../Pagination/Pagination";
import Loading from "../../Loading";
const MyOrder = () => {
  const navigate = useNavigate()

  const [order, setOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [isLoading, setLoading] = useState(false)
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const hanldeViewDetail = (e, orderId) => {
    e.preventDefault();
    navigate(`/member/order-detail/${orderId}`)
  };
  const getOrders = async () => {
    setLoading(true)
    const response = await UserService.getCurrentUserOrdersHistory(currentPage)
    console.log(response)
    if(response?.status !== 400) {
      setOrder(response?.data)
      setTotalPage(response?.total_page)
    }
    setLoading(false)
  }
  useEffect(() => {
    getOrders()
  }, [currentPage])
  return (
    <>
    {isLoading ? (
      <><Loading/></>
    ): (
      <>
       <div>
        {order.length === 0 ? (
          <div className="text-center mt-3">
          Không có đơn hàng nào. <Link to={"/search"}>Mua ngay?</Link>
        </div>
        ): (
          <>
            <table className="order-table table table-bordered ">
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
            {order.map((item) => {
              return (
                <tr>

                  <td>{item.id}</td>
                  <td>{item.product_title}</td>
                  <td>{item.status}</td>
                  <td>{item.created_date}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={(e) => hanldeViewDetail(e, item.id)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <CustomPagination
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
        />
          </>
        )}
          
      </div>
      </>
    )}
     
    </>
  );
};
export default MyOrder;
