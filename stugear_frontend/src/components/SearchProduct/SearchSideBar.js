import "./SearchSideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "react-select-search/style.css";
import CategoryService from "../../service/CategoryService";
import TagService from "../../service/TagService";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";
import ProductService from "../../service/ProductService";
import { debounce } from 'lodash';

import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
const SearchSideBar = ({
  setProducts,
  setTotalPage,
  currentPage,
  setCurrentPage,
  setLoading,
}) => {
  let {slug} = useParams()
  let location = useLocation();
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  const [startDate, setStartDate] = useState(tenYearsAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000000,
  });




  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const getAllTags = async () => {
    const tagResponse = await TagService.getAllTags();
    const options = tagResponse.map((tag) => ({
      label: tag.name,
      style: tag.color,
      value: tag.id, // Convert id to string if necessary
    }));
    setTags(options);
  };
  const getAllCategories = async () => {
    const cateResponse = await CategoryService.getAllCategories();
    const options = cateResponse.map((category) => ({
      label: category.name,
      value: category.id, // Convert id to string if necessary
    }));
    setCategories(options);
  };


  const handleChange = (e) => {
    let debounceTimer;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setQuery(e.target.value);
      setCurrentPage(1)
    }, 400);
   
  };

  useEffect(() => {


    getAllCategories();
    getAllTags();
   

  }, []);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState([
    {
      label: "Đang bán",
      value: 3,
    },
    {
      label: "Đang chờ thanh toán",
      value: 4,
    },
  ]);

  const [condition, setCondition] = useState([
    {
      label: "Đã sử dụng",
      value: 1,
    },
    {
      label: "Chưa sử dụng",
      value: 2,
    },
  ]);
  const [method, setMethod] = useState([
    {
      label: "Trên trang web",
      value: 2,
    },
    {
      label: "Tự do",
      value: 1,
    },
  ]);
  const [statusSelected, setStatusSelected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [cateSelected, setCateSelected] = useState([]);
  const [methodSelected, setMethodSelected] = useState([]);
  // const [statusSelected, setStatusSelected] = useState([]);
  const [conditionSelected, setConditionSelected] = useState([]);

  const DefaultItemRenderer = ({ checked, option, onClick, disabled }) => (
    <div className={`item-renderer ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>
        <div className={`btn btn-outline tag badge ${option.style}`}>
          {option.label}
        </div>
      </span>
    </div>
  );

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Ensure end date is not before the selected start date
    if (date > endDate) {
      setEndDate(date);
      setCurrentPage(1)
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // Ensure start date is not after the selected end date
    if (date < startDate) {
      setStartDate(date);
      setCurrentPage(1)
    }
  };

  const handlePrice = debounce(({ min, max }) => {
    setPriceRange({
      min: min,
      max: max,
    });
    setCurrentPage(1);
  }, 300); // Adjust the debounce delay as needed

  useEffect(() => {

      console.log("lấy");
      const criteria = {
        tags: selected.map((item) => item.value),
        category_id: cateSelected.map((item) => item.value),
        condition: conditionSelected.map((item) => item.value),
        status: statusSelected.map((item) => item.value),
        transaction_method: methodSelected.map((item) => item.value),
        q: query,
        price_from: priceRange.min.toString(),
        price_to: priceRange.max.toString(),
        date_from: startDate?.toLocaleDateString("en-GB"),
        date_to: endDate?.toLocaleDateString("en-GB"),
      }
      if (slug !== "") {
        console.log("select here");
        console.log(slug);
  
        // Parse the search query from the URL
        const searchParams = new URLSearchParams(location.search);
        const tagFromUrl = searchParams.get('tag'); // Get the tag value from the URL
  
        // Check if the tag is a number
        if (tagFromUrl && !isNaN(tagFromUrl)) {
          
  
          // If the tag is found, set it as the selected tag
          
            criteria.tags = [...criteria.tags, parseInt(tagFromUrl)]
          
        }
      }


      getProductsByCriteria(criteria, currentPage);

  }, [
    selected,
    cateSelected,
    conditionSelected,
    methodSelected,
    statusSelected,
    query,
    priceRange,
    startDate,
    endDate,
    currentPage,
  ]);

  const getProductsByCriteria = async (criteria, currentPage) => {
    setLoading(true);
    const response = await ProductService.getProductsByCriteria(
      criteria,
      currentPage
    );
    setProducts(response?.data);
    setTotalPage(response?.total_page);
    setLoading(false);
  };



  return (
    <>
      {/* Filter Section */}
      <div className="card ">
        <div className="card-body filter">
          <div className="filter-search">
            <h5 className="card-title">Tìm kiếm</h5>

            <div className="form-outline search-group input-group my-4">
              <input
                id="search-input"
                placeholder="Tên sản phẩm, người bán, mô tả,..."
                type="search"
                className="form-control"
                name="q"
                onInput={(e) => handleChange(e)}
              />
              <button className="btn search-button">
                <FontAwesomeIcon icon="search" id="search-icon" />
              </button>
            </div>
          </div>

          <div className="filter-price my-4">
            <h5 className="mb-3">Giá</h5>
            <MultiRangeSlider
              min={0}
              max={4000000}
              onChange={({ min, max }) => handlePrice({ min, max })}
            />
          </div>

          <div className="filter-category my-4 mt-5">
            <h5 className="my-3">Danh mục</h5>
            <MultiSelect
              className="filter-tag"
              options={categories}
              value={cateSelected}
              onChange={(cateSelected) => {
                setCateSelected(cateSelected);
                setCurrentPage(1) // Reset currentPage
              }}
              labelledBy="Select"
              overrideStrings={{
                allItemsAreSelected: "Đã chọn tất cả.",
                noOptions: "Không có",
                search: "Tìm kiếm",
                selectAll: "Chọn tất cả",
                selectSomeItems: "Chọn...",
                create: "Tạo mới",
              }}
            />
          </div>

          <div className="filter-tag my-4">
            <h5 className="my-3">Thẻ</h5>

            <MultiSelect
              className="filter-tag"
              options={tags}
              value={selected}
              onChange={(selected) => {
                console.log(selected)
                setSelected(selected);
                setCurrentPage(1) // Reset currentPage
              }}
              labelledBy="Select"
              ItemRenderer={DefaultItemRenderer}
              overrideStrings={{
                allItemsAreSelected: "Đã chọn tất cả.",
                noOptions: "Không có",
                search: "Tìm kiếm",
                selectAll: "Chọn tất cả",
                selectSomeItems: "Chọn...",
                create: "Tạo mới",
              }}
            />
          </div>

          <div className="filter-updated my-5">
            <h5>Ngày đăng</h5>

            <div className="filter-updated start-day my-3">
              <span className="me-3">Từ: </span>
              <DatePicker
                format="dd-MM-y"
                onChange={(date) => handleStartDateChange(date)}
                selected={startDate} 
                value={startDate}
                locale="vi-VN"
              />
            </div>

            <div className="filter-updated end-day my-3">
              <span className="me-2">Đến: </span>
              <DatePicker
                format="dd-MM-y"
                onChange={(date) => handleEndDateChange(date)}
                selected={endDate} 
                value={endDate}
                locale="vi-VN"
              />
            </div>
          </div>

          <div className="filter-condition my-4">
            <h5>Tình trạng</h5>
            <MultiSelect
              className="filter-tag"
              options={condition}
              value={conditionSelected}
              onChange={(conditionSelected) => {
                setConditionSelected(conditionSelected);
                setCurrentPage(1) // Reset currentPage
              }}
              labelledBy="Select"
              overrideStrings={{
                allItemsAreSelected: "Đã chọn tất cả.",
                noOptions: "Không có",
                search: "Tìm kiếm",
                selectAll: "Chọn tất cả",
                selectSomeItems: "Chọn...",
                create: "Tạo mới",
              }}
            />
   
          </div>

          <div className="filter-method my-4">
            <h5>Phương thức thanh toán</h5>
            <MultiSelect
              className="filter-tag"
              options={method}
              value={methodSelected}
              onChange={(methodSelected) => {
                setMethodSelected(methodSelected);
                setCurrentPage(1) // Reset currentPage
              }}
              labelledBy="Select"
              overrideStrings={{
                allItemsAreSelected: "Đã chọn tất cả.",
                noOptions: "Không có",
                search: "Tìm kiếm",
                selectAll: "Chọn tất cả",
                selectSomeItems: "Chọn...",
                create: "Tạo mới",
              }}
            />
          </div>

          <div className="filter-status my-4">
            <h5>Trạng thái giao dịch</h5>
            <MultiSelect
              className="filter-tag"
              options={status}
              value={statusSelected}
              onChange={setStatusSelected}
              labelledBy="Select"
              overrideStrings={{
                allItemsAreSelected: "Đã chọn tất cả.",
                noOptions: "Không có",
                search: "Tìm kiếm",
                selectAll: "Chọn tất cả",
                selectSomeItems: "Chọn...",
                create: "Tạo mới",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchSideBar;
