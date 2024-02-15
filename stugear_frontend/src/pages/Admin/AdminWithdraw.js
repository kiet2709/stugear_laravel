import { useEffect, useState } from "react";
import CategoryService from "../../service/CategoryService";
import Category from "../../components/Landing/Category";
import UserService from "../../service/UserService";
import Loading from "../../components/Loading";
import CustomModal from "../../components/Modal/Modal";
import AskService from "../../service/AskService";
import UserModal from "../../components/Profile/UserModal/UserModal"
import Modal from "react-modal";
import CustomPagination from "../../components/Pagination/Pagination";
import { CSVLink } from "react-csv";
const AdminWithdraw = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
const [selectedWithdraw, setSelectedWithdraw] = useState();
const [changeStatusShow, setChangeStatusShow] = useState(false);
const [isError, setError] = useState("")
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const loadData = async () => {
    setLoading(true);
    const response = await AskService.getListWithdraws(currentPage);

    if (response?.status === 400) {
      console.log("Something wentwrong");
    } else {
      setWithdraws(response?.data);
      setTotalPage(response?.total_page)
    }
    setLoading(false);
    
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);



const handleChangeStatusClose = () => {
  setChangeStatusShow(false);
};
const handleChangeStatusSave = async () => {
  setError("")
  setChangeStatusShow(false);
  const response = await AskService.updateWithdrawStatus(
    selectedWithdraw,
    parseInt(selectedStatus)
  );

  if (response?.status !== 400) {
    setWithdraws(withdraws.map(withdraw => {
      if (withdraw?.id === selectedWithdraw) {
        let statusString;
        switch (selectedStatus) {
          case "3":
            statusString = "Đã hủy";
            break;
          case "2":
            statusString = "Đã xử lý hoàn tất";
            break;
          default:
            statusString = "Mới tạo"; // Default status
            break;
        }
    
        return { ...withdraw, status: statusString };
      }
      return withdraw;
    }));
  } else {
    setError(response?.data?.message);
  }
};
const [headers, setHeaders] = useState([]);
const [data, setData] = useState([]);
const handleDownload = async () => {
  setHeaders([
    { label: "ID", key: "id" },
    { label: "Người yêu cầu", key: "owner_id" },
    { label: "Số tiền", key: "amount" },
    { label: "Nội dung", key: "description" },
    { label: "Trạng thái", key: "status" },
    { label: "Ngày yêu cầu", key: "date" },

  ]);
  
  const response = await AskService.getListWithdraws();
  const withdraws = response?.data;

  if (Array.isArray(withdraws)) {
    setData(
      withdraws.map((withdraw) => ({
        id: withdraw?.id,
        owner_id: withdraw?.owner_id,
        amount: withdraw?.amount,
        status: withdraw?.status,
        description: withdraw?.description,
        date: withdraw?.date
        
      }))
    );
  } 
}
  return (
    <>
      <div style={{ height: "780px" }}>
      <div>   {isError !== "" ? (
          <>
            <span className="text-danger">{isError}</span>
          </>
        ) : (
          <></>
        )}</div>
      <CSVLink
          data={data}
          headers={headers}
          asyncOnClick={true}
          style={{ textDecoration: "none" }}
          className="btn my-3"
          onClick={() => {
            handleDownload();
          }}
          filename={"withdraws.csv"}
        >
          Xuất toàn bộ dữ liệu
        </CSVLink>
    
      <CustomModal
          handleSave={handleChangeStatusSave}
          handleClose={handleChangeStatusClose}
          show={changeStatusShow}
          heading={"Thay đổi trạng thái báo cáo này?"}
          body={`Bạn có muốn thay đổi trạng thái báo cáo này không`}
        ></CustomModal>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col" width="15%">Người yêu cầu</th>
              <th scope="col" width="15%">Số tiền</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Ngày yêu cầu</th>
              <th scope="col">Trạng thái</th>
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
                {withdraws?.map((withdraw) => {
                  return (
                    <tr>
                      <th scope="row" className="text-center" >{withdraw?.id}</th>
                      <td className="text-center"><UserModal userId={withdraw?.owner_id}/></td>
                      <td >{withdraw?.amount}</td>
                      <td>{withdraw.description}</td>
                      <td>{withdraw.date}</td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={withdraw?.status === "Đã xử lý hoàn tất" ? 2 : (withdraw?.status === "Đã hủy" ? 3 : 1)}
                          onChange={(e) => {
                            setSelectedWithdraw(withdraw?.id)
                            setSelectedStatus(e.target.value)
                            setChangeStatusShow(true)
                          }}
                        >
                          <>
                          {withdraw?.status == "Mới tạo" && withdraw?.status !== "Đã hủy"? (
                              <><option value={1}>Mới tạo</option></>
                            ): (
                              <></>
                            )}
                            <option value={2}>Đã xử lý hoàn tất</option>
                            {withdraw?.status !== "Đã xử lý hoàn tất" ? (
                              <option value={3}>Đã hủy</option>
                            ): (
                              <></>
                            )}
                          </>
                        </select>
                      </td>
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
export default AdminWithdraw;
