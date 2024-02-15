import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import "./AdminProduct.css";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import CategoryService from "../../service/CategoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedCategory, setSelected] = useState({});
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updateMessage, setMessage] = useState("");
  const [isError, setError] = useState("");
  const [isCreated, setCreated] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false)
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await CategoryService.getAllCategories();
      if (response?.status === 500) {
        console.log("Something went wrong");
      } else {
        setCategories(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = async () => {
    setHeaders([
      { label: "ID", key: "id" },
      { label: "Tên danh mục", key: "name" },
      { label: "Mô tả", key: "description" },
      { label: "Hình ảnh", key: "image" },
    ]);

    const response = await CategoryService.getAllCategories();
    const categories = response;

    if (Array.isArray(categories)) {
      setData(
        categories.map((category) => ({
          id: category?.id,
          name: category?.name,
          description: category?.description,
          image: category?.image,
        }))
      );
    }
  };

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    if(isCreated){
      setCreated(false)
    }
    setSelectedImage();
    setSelectedImageUrl();
    setSelected({});
    setMessage("");
    setError("")
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleFileChange = async (e) => {
    setError("")
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageUrl(imageUrl);
      setSelectedImage(file);
    } else {
      setSelectedImageUrl(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true)
    if (selectedImage) {
      selectedCategory.image = selectedImageUrl;
      const formData = new FormData();

      formData.append("image", selectedImage);
      await CategoryService.uploadImage(selectedCategory.id, formData);
    }

    const response = await CategoryService.updateById(
      selectedCategory.id,
      selectedCategory
    );
    if (response?.status !== 400) {
      setMessage("Cập nhật thành công");
      setCategories(
        categories.map((category) => {
          if (category?.id === selectedCategory.id) {
            console.log(selectedCategory)
            return { ...category, name: selectedCategory?.name, description: selectedCategory?.description, image:   selectedCategory.image ?  selectedCategory.image : category.image };
          }
          return category;
        })
      );
    } else {
      setMessage("Cập nhật thất bại");
      setHandleLoading(false)
    }
    setHandleLoading(false)
  };
  const handleChange = (e) => {
    setSelected({ ...selectedCategory, [e.target.name]: e.target.value });
  };

  const handleCreatedSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true)
    if (!selectedImage){
      setError("Hãy chọn 1 tấm ảnh thật đẹp nào!")
      setHandleLoading(false)
      return;
      
    }
    const response = await CategoryService.create(selectedCategory);
    if (response?.status !== 400) {
      selectedCategory.id = response?.id;
      if (selectedImage) {
        selectedCategory.image = selectedImageUrl;
        const formData = new FormData();

        formData.append("image", selectedImage);
        await CategoryService.uploadImage(selectedCategory.id, formData);
      }
      setMessage("Cập nhật thành công");
      setCategories([...categories, selectedCategory]);
    } else {
      setMessage("Cập nhật thất bại");
      setHandleLoading(false)
    }
    setHandleLoading(false)
    
  };
  return (
    <>
      <div className="admin-product">
        <div className="d-flex justify-content-between my-3">
          <CSVLink
            data={data}
            headers={headers}
            asyncOnClick={true}
            style={{ textDecoration: "none" }}
            className="btn"
            onClick={() => {
              handleDownload();
            }}
            filename={"categories.csv"}
          >
            Xuất toàn bộ dữ liệu
          </CSVLink>
          <button
            className="btn"
            style={{ backgroundColor: "red" }}
            onClick={() => {
              setCreated(true);
              openModal();
            }}
          >
            + Tạo mới
          </button>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col" width="10%" className="text-center">
                Tên danh mục
              </th>
              <th scope="col" className="text-center">
                Mô tả
              </th>
              <th scope="col" className="text-center">
                Hình ảnh
              </th>
     
              <th scope="col" className="text-center" width="14%">
                Cập nhật
              </th>
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
                {categories?.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td className="text-center">
                      <Link to={"/home-page/category/" + category.id}>
                        <img
                          src={category.image}
                          alt=""
                          className="hover-effect admin-small-img"
                          style={{ width: "90%", height: "100px" }}
                        />
                      </Link>
                    </td>
                    
                    <td className="text-center">
                      <button
                        className="btn"
                        onClick={() => {
                          openModal();
                          setSelected(category);
                        }}
                      >
                        <FontAwesomeIcon icon="pencil" />
                        Chỉnh sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <>
            <section className="">
              <div className="row d-flex justify-content-center align-items-center ">
                <div className="" style={{ borderRadius: 15 }}>
                  <div className="p-2">
                    {updateMessage ? (
                      <>
                        <span className="text-success">{updateMessage}</span>
                      </>
                    ) : (
                      <></>
                    )} 
                    {isError ? (
                      <>
                        <span className="text-danger">{isError}</span>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="d-flex justify-content-between mb-4 mt-2">
                      <button
                        onClick={closeModal}
                        className="btn ms-auto text-white"
                        style={{ backgroundColor: "#ce0c23" }}
                      >
                        {" "}
                        Đóng
                      </button>
                    </div>
                    {isCreated ? (
                      <>
                        <form onSubmit={(e) => handleCreatedSubmit(e)}>
                          <div className="text-center">
                            <div className="category-image">
                              <div className="image-container">
                                <label>
                                  <div className="edit-image">
                                    <FontAwesomeIcon
                                      icon="file-upload"
                                      style={{ width: "30px", height: "30px" }}
                                    />
                                  </div>
                                  <input
                                    type="file"
                                    
                                    className="account-settings-file"
                                    style={{
                                      display: "none",
                                      width: "50px",
                                      height: "50px",
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                  />
                                  {selectedImageUrl ? (
                                    <img
                                      src={selectedImageUrl}
                                      alt=""
                                      className="img-fluid"
                                      style={{
                                        width: 148,
                                        height: 150,
                                        borderRadius: 10,
                                      }}
                                    />
                                  ) : (
                                    <div className="empty-image">Chưa có</div>
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 input-group flex-nowrap">
                            <span className="input-group-text">
                              <FontAwesomeIcon icon="pencil"/>
                            </span>
                            <input
                              required
                              type={"text"}
                              className="form-control"
                              id="floatingPassword"
                              placeholder="Tên danh mục"
                              name="name"
                              onInput={(e) => handleChange(e)}
                              value={selectedCategory.name}
                            />
                          </div>
                          <div className=" pt-1 mt-3">
                            <textarea
                              className="ms-1 form-control"
                              rows={5}
                              required
                              name="description"
                              placeholder="Sản phẩm"
                              style={{ width: "400px" }}
                              onInput={(e) => handleChange(e)}
                            >
                              {selectedCategory?.description}
                            </textarea>
                          </div>
                          <button
                            className="btn my-3"
                            type="submit"
                            style={{ marginLeft: "87%" }}
                          >
                            Lưu
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        <form onSubmit={(e) => handleSubmit(e)}>
                          <div className="text-center">
                            <div className="category-image">
                              <div className="image-container">
                                <label>
                                  <div className="edit-image">
                                    <FontAwesomeIcon
                                      icon="file-upload"
                                      style={{ width: "30px", height: "30px" }}
                                    />
                                  </div>
                                  <input
                                    type="file"
                                    className="account-settings-file"
                                    style={{
                                      display: "none",
                                      width: "50px",
                                      height: "50px",
                                    }}
                                    onChange={(e) => handleFileChange(e)}
                                  />
                                  <img
                                    src={
                                      selectedImageUrl
                                        ? selectedImageUrl
                                        : selectedCategory.image
                                    }
                                    alt=""
                                    className="img-fluid"
                                    style={{
                                      width: 148,
                                      height: 150,
                                      borderRadius: 10,
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="my-3 input-group flex-nowrap">
                            <span className="input-group-text">
                              <FontAwesomeIcon icon="pencil"/>
                            </span>
                            <input
                              required
                              type={"text"}
                              className="form-control"
                              id="floatingPassword"
                              placeholder="Tên sách"
                              name="name"
                              onInput={(e) => handleChange(e)}
                              value={selectedCategory.name}
                            />
                          </div>
                          <div className=" pt-1 mt-3">
                            <textarea
                              className="ms-1 form-control"
                              rows={5}
                              name="description"
                              style={{ width: "400px" }}
                              onInput={(e) => handleChange(e)}
                            >
                              {selectedCategory?.description}
                            </textarea>
                          </div>
                          {handleLoading === true ? (
                            <><Loading/></>
                          ): (
                            <>
                              <button
                            className="btn my-3"
                            type="submit"
                            style={{ marginLeft: "87%" }}
                          >
                            Lưu
                          </button>
                            </>
                          )}
                        
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        </Modal>
      </div>
    </>
  );
};

export default AdminCategory;
