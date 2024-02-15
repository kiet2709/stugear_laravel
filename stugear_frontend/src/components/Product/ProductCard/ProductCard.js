import "./ProductCard.css";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  return (
    <>
      <div className="container text-start product-card ">
        <div class="card-sl ">
          <div className="card-info">
            <Link
              style={{
                textDecoration: "none",
                backgroundColor:
                  product.status === "Chờ duyệt"
                    ? "#FFFBEB"
                    : product.status === "Nháp"
                    ? "#dcf1f7"
                    : "#ECFDF5",
                color:
                  product.status === "Chờ duyệt"
                    ? "#F59E0B"
                    : product.status === "Nháp"
                    ? "#155CA2"
                    : "#10B981",
              }}
              className="card-button"
            >
              <div className="d-flex">
                <span
                  className="ping mt-2 me-2"
                  style={{
                    border:
                      product.status === "Chờ duyệt"
                        ? "4px solid #F59E0B"
                        : product.status === "Nháp"
                        ? "4px solid  #155CA2"
                        : "4px solid #10B981",
                  }}
                ></span>
                <span>
                  {product.status === "Đã duyệt"
                    ? "Đang bán"
                    : product.status === "Đã bán"
                    ? "Chờ thanh toán"
                    : product.status}
                </span>
              </div>
            </Link>
            <div class="card-image">
              <img
                src={product.product_image}
                alt={"/assets/images/book-thumbnail.jpg"}
                className="card-image-full"
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            </div>

            <div class="card-heading">
              {product.title === "" ? "Tiêu đề" : product.title}
            </div>
            <div class="card-text">
              {product.description === ""
                ? "miêu tả"
                : product?.description?.slice(0, 60)}
            </div>
          </div>
          <div class="card-text">
            {parseInt(product?.origin_price) > parseInt(product?.price) ? (
              <>
                <span
                  className="me-4"
                  style={{ textDecoration: "line-through" }}
                >
                  {product.origin_price}
                </span>
                <span style={{ fontSize: "17px", color: "red", fontWeight: 'bold' }}>
                  {product.price}
                </span>
              </>
            ) : (
              <>
                <b style={{ fontSize: "17px", marginLeft: '50%'}}>
                  {product.price}
                </b>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
