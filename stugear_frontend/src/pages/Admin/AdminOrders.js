import { useEffect, useState } from "react";
import CategoryService from "../../service/CategoryService";
import Category from "../../components/Landing/Category";
import UserService from "../../service/UserService";
import Loading from "../../components/Loading";
import CustomModal from "../../components/Modal/Modal";
import AskService from "../../service/AskService";
import UserModal from "../../components/Profile/UserModal/UserModal";
import { CSVLink } from "react-csv";
import CustomPagination from "../../components/Pagination/Pagination";
import OrderService from "../../service/OrderService";
const AdminOrder = () => {
  const [orders, setorders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const loadData = async () => {
    setLoading(true);
    const response = await OrderService.getAllOrders(currentPage);

    if (response?.status === 400) {
      console.log("Something wentwrong");
    } else {
      setorders(response?.data);
      setTotalPage(response?.total_page)
    }
    setLoading(false);
  };

  const [selectedorder, setSelectedorder] = useState();
  const [changeStatusShow, setChangeStatusShow] = useState(false);
  const [isError, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleChangeStatusClose = () => {
    setChangeStatusShow(false);
  };
  const handleChangeStatusSave = async () => {
    setError("");
    setChangeStatusShow(false);
    const response = await OrderService.updateStatusByAdmin(
      selectedorder,
      7 // hoàn tiền
    );

    if (response?.status !== 400) {
      setorders(
        orders.map((order) => {
          if (order?.id === selectedorder) {
           
            return { ...order, status: "Hoàn tiền" };
          }
          return order;
        })
      );
    } else {
      setError(response?.data?.message);
    }
  };

  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);

  const handleDownload = async () => {
    setHeaders([
      { label: "ID", key: "id" },
      { label: "Người mua", key: "buyer_id" },
      { label: "Người bán", key: "seller_id" },
      { label: "Tên sản phẩm", key: "product_name" },
      { label: "Hình ảnh", key: "product_image" },
      { label: "Số lượng", key: "quantity" },
      { label: "Tổng giá", key: "total" },
      { label: "Trạng thái", key: "status" },
      { label: "Ngày tạo", key: "created_date" },
    ]);

      const response =  await OrderService.getAllOrders()
      if(response?.status !== 400){
        setData(
          response?.data.map((order) => ({
            id: order?.id,
            buyer_id: order?.buyer_id,
            seller_id: order?.seller_id,
            product_name: order?.product_name,
            product_image: order?.product_image,
            quantity: order?.quantity,
            total: order?.total,
            status: order?.status,
            created_date: order?.created_date,
          }))
        );
      }
     
    
  };
  return (
    <>
      <div style={{ height: "780px" }}>
        <CustomModal
          handleSave={handleChangeStatusSave}
          handleClose={handleChangeStatusClose}
          show={changeStatusShow}
          heading={"Thay đổi trạng thái báo cáo này?"}
          body={`Bạn có muốn thay đổi trạng thái báo cáo này không`}
        ></CustomModal>
        {isError !== "" ? (
          <>
            <span className="text-danger">{isError}</span>
          </>
        ) : (
          <></>
        )}

        <CSVLink
          data={data}
          headers={headers}
          asyncOnClick={true}
          style={{ textDecoration: "none" }}
          className="btn my-3"
          onClick={() => {
            handleDownload();
          }}
          filename={"order.csv"}
        >
          Xuất toàn bộ dữ liệu
        </CSVLink>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col" className="text-center">
                Người mua
              </th>
              <th scope="col" className="text-center">
                Người bán
              </th>
              <th scope="col" className="text-center">
                Tên sản phẩm
              </th>
              <th scope="col" className="text-center">
                Hình ảnh
              </th>
              <th scope="col" className="text-center">
                Số lượng
              </th>
              <th scope="col" className="text-center">
                Giá
              </th>

              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {" "}
                {orders?.map((order) => {
                  return (
                    <tr>
                      <th scope="row" className="text-center">
                        {order?.id}
                      </th>
                      <td className="text-center">
                        <UserModal userId={order?.buyer_id} />
                      </td>
                      <td className="text-center">
                        <UserModal userId={order?.seller_id} />
                      </td>
                      <td>{order?.product_name}</td>
                      <td className="text-center">

                      <img
                          src={order?.product_image}
                          alt=""
                          style={{ width: "100px", height: "100px" }}
                        />
                      </td>
                      <td className="text-center">{order?.quantity}</td>
                      <td className="text-center">
                  
                          {order.total} VNĐ
                
                      </td>

              
                      <td>
                          
                          {order?.status == "Đã nhận được hàng hoàn" ? (
                            <>
                            <div>
                            <p>{order?.status}</p>
                            <button className="btn" onClick={() => {setSelectedorder(order?.id); setChangeStatusShow(true)}}>Hoàn tiền ?</button>
                              </div></>
                          ): (
                            <>{order?.status}</>
                          )}
                      </td>
                      <td>{order?.created_date}</td>
            
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
        <div className="">
          <CustomPagination
            currentPage={currentPage}
            totalPage={totalPage}
            prevPage={prevPage}
            nextPage={nextPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};
export default AdminOrder;
