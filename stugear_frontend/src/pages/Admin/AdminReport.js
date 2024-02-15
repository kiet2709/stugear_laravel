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
const AdminReport = () => {
  const [reports, setReports] = useState([]);
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
    const response = await AskService.getListReport(currentPage);

    if (response?.status === 400) {
      console.log("Something wentwrong");
    } else {
      setReports(response?.data);
      setTotalPage(response?.total_page)
    }
    setLoading(false);
  };
  const [selectedStatus, setSelectedStatus] = useState();
  const [selectedReport, setSelectedReport] = useState();
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
    const response = await AskService.updateReportStatus(
      selectedReport,
      parseInt(selectedStatus)
    );

    if (response?.status !== 400) {
      setReports(
        reports.map((report) => {
          if (report?.id === selectedReport) {
            let statusString;
            switch (parseInt(selectedStatus)) {
              case 3:
                statusString = "Đã hủy";
                break;
              case 2:
                statusString = "Đã xử lý hoàn tất";
                break;
              default:
                statusString = "Mới tạo"; // Default status
                break;
            }

            return { ...report, status: statusString };
          }
          return report;
        })
      );
    } else {
      setError(response?.data?.message);
    }
  };
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const handleDownload = async (reports, isAll) => {
    setHeaders([
      { label: "ID", key: "id" },
      { label: "Người báo cáo", key: "owner" },
      { label: "Đối tượng", key: "denounced" },
      { label: "Nội dung", key: "description" },
      { label: "Minh chứng", key: "image" },
      { label: "Trạng thái", key: "status" },
      { label: "Ngày", key: "date" },
    ]);
    if(isAll===true){
      const response = await AskService.getListReport();
      reports = response?.data
    }
  
    
    if (Array.isArray(reports)) {
      setData(
        reports.map((report) => ({
          id: report?.id,
          owner: report?.owner_id,
          denounced: report?.denounced_id,
          description: report?.description,
          image: report?.image,
          status: report?.status,
          date: report?.date,
        }))
      );
    } else {
      setData([
        {
          id: reports?.id,
          owner: reports?.owner_id,
          denounced: reports?.denounced_id,
          description: reports?.description,
          image: reports?.image,
          status: reports?.status,
          date: reports?.date,
        },
      ]);
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
            handleDownload(reports, true);
          }}
          filename={"report-all.csv"}
        >
          Xuất toàn bộ dữ liệu
        </CSVLink>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col" className="text-center">
                Người báo cáo
              </th>
              <th scope="col" className="text-center">
                Đối tượng
              </th>
              <th scope="col" className="text-center">
                Nội dung
              </th>

              <th scope="col">Minh chứng</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Ngày</th>
              <th scope="col">Chi tiết</th>
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
                {reports?.map((report) => {
                  return (
                    <tr>
                      <th scope="row" className="text-center">
                        {report?.id}
                      </th>
                      <td className="text-center">
                        <UserModal userId={report?.owner_id} />
                      </td>
                      <td className="text-center">
                        <UserModal userId={report?.denounced_id} />
                      </td>
                      <td>
                        <div
                          style={{
                            width: "200px",
                            height: "200px",
                            overflow: "auto",
                          }}
                        >
                          {report.description}
                        </div>
                      </td>

                      <td>
                        <img
                          src={report?.image}
                          alt=""
                          style={{ width: "200px", height: "200px" }}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={
                            report?.status === "Đã xử lý hoàn tất"
                              ? 2
                              : report?.status === "Đã hủy"
                              ? 3
                              : 1
                          }
                          onChange={(e) => {
                            setSelectedReport(report?.id);
                            setSelectedStatus(e.target.value);
                            setChangeStatusShow(true);
                          }}
                        >
                          <>
                            {report?.status == "Mới tạo" && report?.status !== "Đã hủy"? (
                              <><option value={1}>Mới tạo</option></>
                            ): (
                              <></>
                            )}
                            <option value={2}>Đã xử lý hoàn tất</option>
                            {report?.status !== "Đã xử lý hoàn tất" ? (
                              <option value={3}>Đã hủy</option>
                            ): (
                              <></>
                            )}
                            
                          </>
                        </select>
                      </td>
                      <td>{report.date}</td>
                      <td>
                        <CSVLink
                          data={data}
                          headers={headers}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            handleDownload(report); // 👍🏻 Your click handling logic
                          }}
                          filename={"report.csv"}
                        >
                          Xuất dữ liệu
                        </CSVLink>
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
export default AdminReport;
