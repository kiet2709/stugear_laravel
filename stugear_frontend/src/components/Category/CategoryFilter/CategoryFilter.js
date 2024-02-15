import { useEffect, useState } from "react";
import "./CategoryFilter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductService from "../../../service/ProductService";
import { InputGroup, Button } from "react-bootstrap";
const CategoryFilter = ({
  setTotalProduct,
  setTotalPage,
  category_id,
  currentPage,
  setCurrentPage,
  setProducts,
  setLoading,
}) => {
  const [transactionMethod, setTransactionMethod] = useState("");
  const [field, setField] = useState("");
  const [sort, setSort] = useState("");
  const [query, setQuery] = useState("");
  const [sortLastUpdate, setSortLastUpdate] = useState("increase"); // Sort direction for "Ngày đăng"
  const [sortPrice, setSortPrice] = useState("increase"); // Sort direction for "Giá bán"
  
  const search = async (criterial, currentPage) => {
    setLoading(true);
    const response = await ProductService.searchInCategory(
      criterial,
      currentPage
    );

    setProducts(response);
    setTotalPage(response?.total_pages);
    setTotalProduct(response?.total_in_all_page);
    setLoading(false);
  };

  useEffect(() => {
    const criterial = {
      category_id: category_id,
      transaction_method: transactionMethod,
      field: field,
      sort: sort,
      q: query,
    };

    search(criterial, currentPage);
  }, [transactionMethod, field, sort, currentPage, query]);

  let debounceTimer;

  const handleInputChange = (e) => {
    clearTimeout(debounceTimer);

    const input = e.target.value;
    debounceTimer = setTimeout(() => {
      setQuery(input);
      setCurrentPage(1);
    }, 400); // Adjust the debounce time (in milliseconds) as needed
  };
  const handleSortClick = (fieldValue) => {
    setField(fieldValue);
    
    // Toggle the sort direction based on the field
    if (fieldValue === "lastUpdate") {
      setSortLastUpdate(sortLastUpdate === "increase" ? "decrease" : "increase");
    } else if (fieldValue === "price") {
      setSortPrice(sortPrice === "increase" ? "decrease" : "increase");
    }
    setSort(sort === "increase" ? "decrease" : "increase")
    setCurrentPage(1);
  };

  const getArrowIconColor = (sortDirection) => {
    return sortDirection === "increase" ? "red" : "green";
  };
  return (
    <>
      <div className="row">
        <div className="col-4 mt-2">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="cash-radio"
              value="cash"
              onChange={() => {
                setTransactionMethod("cash");
                setCurrentPage(1);
              }}
            />
            <label className="form-check-label" htmlFor="cash-radio">
              Tự do
            </label>
          </div>

          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="website-radio"
              value="online"
              onChange={() => {
                setTransactionMethod("online");
                setCurrentPage(1);
              }}
            />
            <label className="form-check-label" htmlFor="website-radio">
              Qua website
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="all-method"
              value="all"
              onChange={() => {
                setTransactionMethod("");
                setCurrentPage(1);
              }}
            />
            <label className="form-check-label" htmlFor="all-method">
              Tất cả
            </label>
          </div>
        </div>

        <div className="col">
          <div className="row">
            <div className="col-4" style={{ marginRight: "300px" }}>
              <InputGroup
                className="form-outline"
                id="search-group"
                style={{ width: "280px" }}
              >
                <input
                  id="search-input"
                  placeholder="Nhập tên sản phẩm, tên người bán,..."
                  type="search"
                  className="form-control"
                  onChange={(e) => handleInputChange(e)}
                />
                <Button id="search-button">
                  <FontAwesomeIcon icon="search" id="search-icon" />
                </Button>
              </InputGroup>
            </div>
            <div className="dropdown col-3">
        <button className="btn dropdown-toggle" id="dropdown" data-bs-toggle="dropdown" >
          Sắp xếp
        </button>

        <ul className="dropdown-menu  mt-2" aria-labelledby="dropdown">
          <li>
            <button className="dropdown-item" onClick={() => handleSortClick("lastUpdate")}>
              <FontAwesomeIcon icon={sortLastUpdate === "increase" ? "arrow-down" : "arrow-up"} style={{ color: getArrowIconColor(sortLastUpdate) }} /> Ngày đăng
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => handleSortClick("price")}>
              <FontAwesomeIcon icon={sortPrice === "increase" ? "arrow-down" : "arrow-up"} style={{ color: getArrowIconColor(sortPrice) }} /> Giá bán
            </button>
          </li>
        </ul>
      </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
