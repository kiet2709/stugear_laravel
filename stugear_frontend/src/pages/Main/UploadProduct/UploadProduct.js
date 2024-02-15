import "./UploadProduct.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { faFileText } from "@fortawesome/free-regular-svg-icons";
import ProductService from "../../../service/ProductService";
import CategoryService from "../../../service/CategoryService";
import TagService from "../../../service/TagService";
import Loading from "../../../components/Loading/index";
import useProduct from "../../../hooks/useProduct";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CustomModal from "../../../components/Modal/Modal";
// "chặn": "0",
// "nháp": "1",
// "chờ duyệt": "2",
// "đã duyệt": "3",
// "đã bán": "4",
// "đã thanh toán": "5"
import Modal from "react-modal";
const UploadProduct = () => {
  const { productCount, setProductCount } = useProduct();
  let { slug } = useParams();
  const navigate = useNavigate();
  const [isError, setError] = useState([]);
  const [isAdded, setAdded] = useState(false);
  const [isUpdated, setupdated] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    condition: 1,
    edition: "",
    quantity: 2,
    brand: "",
    status: 2, // chờ duyệt
    origin_price: "",
    category_id: 1,
    transaction_id: 2,
    description: "",
    product_image: "",
    tags: [],
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const [isLoading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const getAllCategories = async () => {
    const cateResponse = await CategoryService.getAllCategories();
    setCategories(cateResponse);
  };

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
  const getAllTags = async () => {
    const tagResponse = await TagService.getAllTags();
    const options = tagResponse.map((tag) => ({
      label: tag.name,
      style: tag.color,
      value: tag.id, // Convert id to string if necessary
    }));
    setTags(options);
  };

  const getProductById = async (id) => {
    const response = await ProductService.getProductById(id);
    if (response.status === 404) {
      navigate("/not-found");
    }
    const priceString = response?.price;
    const originPriceString = response?.origin_price;

    // Remove non-numeric characters (commas and VNĐ) from the string
    const numericPriceString = priceString.replace(/[^\d]/g, "");
    const numericOriginPriceString = originPriceString.replace(/[^\d]/g, "");
    // Convert the numeric string to an integer
    const price = parseInt(numericPriceString, 10);
    const originPrice = parseInt(numericOriginPriceString, 10);
    const selected = response?.tags?.map((tag) => ({
      label: tag.name,
      style: tag.color,
      value: tag.id, // Convert id to string if necessary
    }));
    setSelected(selected);
    setProduct({
      id: response?.id,
      name: response?.title,
      price: price,
      condition: response?.condition === "Cũ" ? 1 : 2,
      edition: response?.edition,
      quantity: response?.quantity,
      brand: response?.brand,
      status: response?.status === "Chờ duyệt" ? 2 : 1, // chờ duyệt
      origin_price: originPrice,
      category_id: response?.category_id == null ? 1 : response?.category_id,
      transaction_id: response?.transaction_method === "Trên trang web" ? 2 : 1,
      description: response?.description,
      product_image: response?.product_image,
      tags: response?.tags,
      owner_id: response?.owner_id,
    });
    console.log(product);
  };
  const validate = async (categoryId) => {
    // Check if categoryId exists in the categories array
    const isExist = await CategoryService.getCategoriesById(categoryId);

    if (isExist?.status === 404) {
      navigate("/not-found");
    }
  };
  useEffect(() => {
    setLoading(true);
    
    if (slug !== undefined) {
      if (!isNaN(slug)) {
        // Check if slug is a number
        getProductById(slug);
        setupdated(true);
      } else if (slug.includes("category-id=")) {
        const categoryId = slug.split("category-id=")[1];
        validate(categoryId);

        setProduct({ ...product, category_id: categoryId });
      }
    }
    getAllCategories();
    getAllTags();
    setLoading(false);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setProduct({ ...product, product_image: imageUrl });
  };
  const handleDraft = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProduct({ ...product, status: 1 });
    const response = await ProductService.createDraft(product);
    let productId = 0;
    if (response?.id) {
      productId = response.id;
    } else {
      console.log("Some thing went wrong");
      return;
    }
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
      const responseImg = await ProductService.uploadImage(productId, formData);
      console.log(responseImg);
      if (responseImg?.status === 400) {
        console.log("aaa");
      }
    }
    const newItems = selected.filter((item) => item.__isNew__);
    const tag_ids = await TagService.createTags(
      newItems.map((item) => item.value)
    );
    const otherItems = selected.filter((item) => !item.__isNew__);
    await ProductService.attachTag(
      productId,
      otherItems.map((item) => item.value).concat(tag_ids)
    );
    setLoading(false);
    setAdded(true);
    toast.success("Lưu nháp thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setProductCount({
      ...productCount,
      myProduct: parseInt(productCount.myProduct) + 1,
    });
    localStorage.setItem("product", parseInt(productCount.myProduct) + 1);
    navigate("/member/my-product");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProduct({ ...product, status: 2 });
    if (product?.product_image === "") {
      setError({ ...isError, image: ["Vui lòng chọn hình ảnh"] });
      return;
    }

    const response = await ProductService.updateProduct(product);
    if (response?.status === "success") {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
        await ProductService.uploadImage(product?.id, formData);
      }

      const newItems = selected.filter((item) => item.__isNew__);
      const tag_ids = await TagService.createTags(
        newItems.map((item) => item.value)
      );
      const otherItems = selected.filter((item) => !item.__isNew__);
      await ProductService.attachTag(
        product?.id,
        otherItems.map((item) => item.value).concat(tag_ids)
      );
      setLoading(false);
      navigate(`/home-page/product-detail/${product?.id}`);
    } else {
      if (response?.data?.error) {
        let translatedErrors = {};
        for (const key in response.data.error) {
          translatedErrors[key] = response.data.error[key].map(translateError);
        }
        setError(translatedErrors);
      }
      setLoading(false);
      return;
    }
    await ProductService.updateStatus(product?.id, 2);
  };
  const errorTranslations = {
    "The name field is required.": "Tên là bắt buộc.",
    "The price field is required.": "Giá là bắt buộc.",
    "The edition field is required.": "Phiên bản là bắt buộc.",
    "The origin price field is required.": "Giá gốc là bắt buộc.",
    "The origin price field must be at least 1.": "Giá gốc phải lớn hơn 1000",
    "The price field must be at least 1.": "Giá bán phải lớn hơn 1000",
    "The name field must be a string.": "Tên là bắt buộc",
  };

  const translateError = (englishError) => {
    return errorTranslations[englishError] || englishError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProduct({ ...product, status: 2 });
    if (selectedFile === undefined) {
      setError({ ...isError, image: ["Vui lòng chọn hình ảnh"] });
      return;
    }
    const response = await ProductService.createProduct(product);
    if (response?.status === 400) {
      if (response?.data?.error) {
        let translatedErrors = {};
        for (const key in response.data.error) {
          translatedErrors[key] = response.data.error[key].map(translateError);
        }
        setError(translatedErrors);
      }
      setLoading(false);
      return;
    }
    let productId = 0;
    if (response?.id) {
      productId = response.id;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        await ProductService.uploadImage(productId, formData);
      } else {
        setError({ ...isError, image: ["Vui lòng chọn hình ảnh"] });
      }
    } else {
      console.log("Some thing went wrong");
      return;
    }

    const newItems = selected.filter((item) => item.__isNew__);
    const tag_ids = await TagService.createTags(
      newItems.map((item) => item.value)
    );
    const otherItems = selected.filter((item) => !item.__isNew__);
    await ProductService.attachTag(
      productId,
      otherItems.map((item) => item.value).concat(tag_ids)
    );
    setLoading(false);
    setAdded(true);
    toast.success("Đăng sản phẩm thành công!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setProductCount({
      ...productCount,
      myProduct: parseInt(productCount.myProduct) + 1,
    });
    localStorage.setItem("product", parseInt(productCount.myProduct) + 1);
    navigate("/member/my-product");
  };

  const [selected, setSelected] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const handleDelete = async () => {
    const response = await ProductService.deleteProduct(product?.id);
    setProductCount({
      ...productCount,
      myProduct: parseInt(productCount.myProduct) - 1,
    });
    localStorage.setItem("product", parseInt(productCount.myProduct) - 1);
    navigate("/member/my-product");
  };

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleSave = () => {
    handleDelete();
  };

  return (
    <>
      <div className="card my-5 p-5">
        <form style={{ minHeight: "1100px" }}>
          <div className="row product-type my-5 ">
            <div className="col-5 text-start">
              <h3>Chọn thể loại.</h3>
              <span>
                Cung cấp thể loại và lĩnh vực rõ ràng sẽ giúp sản phẩm của bạn
                dễ dàng được tìm thấy bởi các khách hàng tìm năng
              </span>
            </div>

            <div className="col">
              <h5>
                Danh mục <span className="require">*</span>
              </h5>
              <select
                class="form-select"
                aria-label="Default select example"
                required
                name="category_id"
                onChange={(e) => handleChange(e)}
                value={product.category_id}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <h5>Thẻ</h5>
              <MultiSelect
                className="multi-select"
                options={tags}
                value={selected}
                onChange={setSelected}
                labelledBy="Select"
                isCreatable="true"
                ItemRenderer={DefaultItemRenderer}
                // customValueRenderer={customValueRenderer}
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
            <div className="col">
              <div className="col">
                <h5>Phương thức</h5>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  required
                  name="transaction_id"
                  onChange={(e) => handleChange(e)}
                  value={product.transaction_id}
                >
                  <option value="1">Tự do</option>
                  <option value="2">Trên web</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row product-detail my-5 ">
            <div className="col-5 text-start">
              <h3>Chi tiết sản phẩm</h3>
              <span>
                Cung cấp thể loại và lĩnh vực rõ ràng sẽ giúp sản phẩm của bạn
                dễ dàng được tìm thấy bởi các khách hàng tìm năng
              </span>
            </div>
            <div className="col">
              <h5>
                Tiêu đề <span className="require">*</span>
              </h5>
              <div className="my-3 input-group flex-nowrap">
                <span className="input-group-text">
                  {" "}
                  <FontAwesomeIcon icon={faFileText} />
                </span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Nhập tiêu đề sản phẩm"
                  name="name"
                  onChange={(e) => {
                    handleChange(e);
                    setError({ ...isError, name: [] });
                  }}
                  value={product.name}
                />
              </div>
              {isError?.name && (
                <>
                  <p className="text-danger">{isError?.name[0]}</p>
                </>
              )}

              <div className="row">
                <div className="form-group mt-3 col-12">
                  <h5 className="form-label">Mô tả</h5>
                  <textarea
                    className="form-control"
                    rows={5}
                    name="description"
                    onChange={(e) => handleChange(e)}
                    value={product.description}
                  />
                </div>
                <div className="col mt-4">
                  <h5>Thương hiệu</h5>
                  <div className="my-3 input-group">
                    <span className="input-group-text">
                      {" "}
                      <FontAwesomeIcon icon={faFileText} />
                    </span>
                    <input
                      required
                      type="text"
                      className="form-control"
                      placeholder="Tên thương hiệu"
                      name="brand"
                      onChange={(e) => handleChange(e)}
                      value={product.brand}
                    />
                  </div>
                </div>
                <div className="col mt-4">
                  <h5>
                    Phiên bản <span className="require">*</span>
                  </h5>
                  <div className="my-3 input-group">
                    <span className="input-group-text">
                      {" "}
                      <FontAwesomeIcon icon={faFileText} />
                    </span>
                    <input
                      required
                      type="text"
                      className="form-control"
                      placeholder="Tên phiên bản"
                      name="edition"
                      onChange={(e) => {
                        handleChange(e);
                        setError({ ...isError, edition: [] });
                      }}
                      value={product.edition}
                    />
                  </div>
                  {isError?.edition && (
                    <>
                      <p className="text-danger">{isError?.edition[0]}</p>
                    </>
                  )}
                </div>

                <div className="col-12 mt-4">
                  <h5 className="my-3">
                    Hình minh họa <span className="require">*</span>
                  </h5>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="file"
                      id="formFile"
                      name="product_image"
                      required
                      onChange={(e) => {
                        handleFileChange(e);
                        setError({ ...isError, image: [] });
                      }}
                    />
                  </div>
                  {isError?.image && (
                    <>
                      <p className="text-danger">{isError?.image[0]}</p>
                    </>
                  )}
                  {product?.product_image && (
                    <div className="text-center">
                      <img
                        src={product?.product_image}
                        alt="Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className=" row product-price my-5">
            <div className="col-5 text-start">
              <h3>Tình trạng</h3>
              <span>Tình trạng sản phẩm của bạn thế nào</span>
            </div>
            <div className="col">
              <div className="row ">
                <div className="input-group">
                  <div className="input-group-prepend ">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect01"
                    >
                      Trạng thái <span className="require"> *</span>
                    </label>
                  </div>
                  <select
                    className="custom-select w-50 "
                    id="inputGroupSelect01"
                    name="condition"
                    
                    onChange={(e) => handleChange(e)}
                    value={product.condition}
                  >
                    <option selected>Chọn...</option>
                    <option value={1}>Cũ</option>
                    <option value={2}>Mới</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="col">
                <div className="input-group">
                  <div className="input-group-prepend ">
                    <label
                      className="input-group-text"
                      htmlFor="inputGroupSelect02"
                    >
                      Số lượng
                    </label>
                  </div>
                  <div className="form-outline">
                    <input
                      type="number"
                      className="form-control"
                      id="inputGroupSelect02"
                      defaultValue={1}
                      name="quantity"
                      onChange={(e) => handleChange(e)}
                      value={product.quantity}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" row product-price my-3">
            <div className="col-5 text-start">
              <h3>Giá</h3>
              <span>
                Bạn có thể cung cấp sản phẩm miễn phí hoặc với 1 mức giá nhất
                định
              </span>
            </div>
            <div className="col">
              <h5>
                Giá gốc <span className="require">*</span>
              </h5>
              <div className="input-group mb-3">
                <input
                  defaultValue={0}
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  name="origin_price"
                  onChange={(e) => {
                    handleChange(e);
                    setError({ ...isError, origin_price: [] });
                  }}
                  value={product.origin_price}
                />
                <div className="input-group-append">
                  <span className="input-group-text">VNĐ</span>
                </div>
              </div>
              {isError?.origin_price && (
                <>
                  <p className="text-danger">{isError?.origin_price[0]}</p>
                </>
              )}
            </div>
            <div className="col">
              <h5>
                Giá bán <span className="require">*</span>
              </h5>
              <div className="input-group mb-3">
                <input
                  defaultValue={0}
                  type="text"
                  className="form-control"
                  aria-label="Amount (to the nearest dollar)"
                  name="price"
                  onChange={(e) => {
                    handleChange(e);
                    setError({ ...isError, price: [] });
                  }}
                  value={product.price}
                />
                <div className="input-group-append">
                  <span className="input-group-text">VNĐ</span>
                </div>
              </div>
              {isError?.price && (
                <>
                  <p className="text-danger">{isError?.price[0]}</p>
                </>
              )}
            </div>
          </div>
          {isLoading ? (
            <><Loading/></>
          ): (
            <>
               <div className="mt-5 d-flex" style={{ marginLeft: "76%" }}>
            {slug == undefined ||
              slug.includes("category-id=") ? (
                <>
                  <div className=" mb-3 me-2">
                    <Link
                      style={{ textDecoration: "None", color: "black" }}
                      onClick={(e) => handleDraft(e)}
                    >
                      <button className="product-draft">
                        {" "}
                        <FontAwesomeIcon
                          icon="drafting-compass"
                          className="me-2"
                        />{" "}
                        Lưu bản nháp
                      </button>
                    </Link>
                  </div>
                </>
              ): (<></>)}
            <div className="mb-3 me-2">
              <Link
                style={{ textDecoration: "None", color: "black" }}
                onClick={(e) => {
                  if (isUpdated === true) {
                    handleUpdate(e);
                  } else handleSubmit(e);
                }}
              > 
           <button className="product-edit">
                {" "}
                <FontAwesomeIcon icon="pencil" /> Đăng
              </button>
             
              </Link>
            </div>

            {isUpdated === true ? (
              <>
                <div className="mb-3">
                  <Link
                    style={{ textDecoration: "None", color: "black" }}
                    onClick={() => setShow(true)}
                  >
                    <button className="product-remove">
                      <FontAwesomeIcon icon="trash" className="me-2" />
                      {""}
                      Xóa sản phẩm
                    </button>
                  </Link>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
            </>
          )}
       
        </form>

        {isAdded ? (
          <>
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </>
        ) : (
          <></>
        )}
        <CustomModal
          handleSave={handleSave}
          handleClose={handleClose}
          show={show}
          heading={"Xóa sản phẩm"}
          body={"Bạn muốn xóa đi sản phẩm này?"}
        ></CustomModal>
      </div>
    </>
  );
};

export default UploadProduct;
