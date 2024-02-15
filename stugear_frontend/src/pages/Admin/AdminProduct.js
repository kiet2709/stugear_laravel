import { useEffect, useState } from "react";
import ProductService from "../../service/ProductService";
import CustomPagination from "../../components/Pagination/Pagination";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./AdminProduct.css";
import { MultiSelect } from "react-multi-select-component";
import CategoryService from "../../service/CategoryService";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
const AdminUser = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const updateStatus = async (id, status) => {
    try {
      await ProductService.updateStatus(id, status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAllProducts(currentPage);
        if (response?.status === 500) {
          console.log("Something went wrong");
        } else {
          setTotalPage(response?.total_page);
          setProducts(response?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLoading(false);
    };
    loadData();
  }, [currentPage]);

  const convertStatusToName = (status) => {
    switch (status) {
      case 2:
        return "Chờ duyệt";
      case 3:
        return "Đã duyệt";
      default:
        return "Hết hàng";
    }
  };

  const handleStatusChange = async (e, productId, status) => {
    let selectedStatus = ""
    if(e !== undefined){
      selectedStatus = e.target.value;
    }else{
      selectedStatus = status
    }
    console.log(selectedStatus);
    await updateStatus(productId, selectedStatus);
    const selectedStatusString = convertStatusToName(selectedStatus);
    console.log(selectedStatusString);
    // Update products status here
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, status: selectedStatusString };
      }
      return product;
    });

    // Now update the state with the updated products
    setProducts(updatedProducts);
  };
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const handleDownload = async () => {
    setHeaders([
      { label: "ID", key: "id" },
      { label: "Ảnh", key: "image" },
      { label: "Tiêu đề", key: "title" },
      { label: "Giá", key: "price" },
      { label: "Trạng thái", key: "status" },
      { label: "Tình trạng", key: "condition" },
      { label: "Giá gốc", key: "origin_price" },
      { label: "Số lượt bình luận", key: "comment_count" },
      { label: "Cập nhật lần cuối", key: "date" },
    ]);
    
    const response = await ProductService.getAllProducts();
    const products = response?.data;

    if (Array.isArray(products)) {
      setData(
        products.map((product) => ({
          id: product?.id,
          image: product?.product_image,
          title: product?.title,
          description: product?.description,
          price: product?.price,
          status: product?.status,
          condition: product?.condition,
          origin_price: product?.origin_price,
          comment_count: product?.comment_count,
          date: product?.last_updated,
        }))
      );
    } 
  }
    return (
      <>
        <div className="admin-product">
          <CSVLink
            data={data}
            headers={headers}
            asyncOnClick={true}
            style={{ textDecoration: "none" }}
            className="btn my-3"
            onClick={() => {
              handleDownload();
            }}
            filename={"product.csv"}
          >
            Xuất toàn bộ dữ liệu
          </CSVLink>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col" className="text-center">ID</th>
                <th scope="col" className="text-center">Ảnh</th>
                <th scope="col">Tiêu đề</th>
                <th scope="col">Giá</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Cập nhật cuối</th>
              </tr>
            </thead>
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {" "}
                <tbody>
                  {products?.map((product) => (
                    <tr key={product.id}>
                      <td className="text-center">{product.id}</td>
                      <td className="text-center">
                      {product.status == "Nháp" ? (
                        <>
                         <img
                            src={product.product_image}
                            alt=""
                            className="admin-small-img"
                            style={{ width: "90%", height: "100px" }}
                          />
                        </>
                      ): (
                        <>
                        <Link to={`/home-page/product-detail/${product.id}`}>
                          <img
                            src={product.product_image}
                            alt=""
                            className="hover-effect admin-small-img"
                            style={{ width: "90%", height: "100px" }}
                          />
                        </Link>
                        </>
                      )}
                        
                      </td>
                      <td>{product.title}</td>
                      <td>{product.price}</td>
                      <td>{product.status}
                      {product?.status === "Chờ duyệt" ? (
                        <><div className="mt-1"><button className="btn" onClick={() => handleStatusChange(undefined, product.id, 3)}>Duyệt</button></div></>
                      ): (
                        <></>
                      )}
                      </td>
                  
                      
                    
                      <td>{product.last_updated}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
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

export default AdminUser;
