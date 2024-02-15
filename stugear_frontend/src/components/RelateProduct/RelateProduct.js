import "./RelateProduct.css";
import { Link } from "react-router-dom";
const RelateProduct = ({ products }) => {
  return (
    <div className="card relate-product  ">
      <div className="card-header relate-product-header text-white">
        Bài đăng liên quan
      </div>
      <div className="card-body relate-product-body">
        {products.length === 0 ? (
          <>
            <p className="text-center">Không có sản phẩm nào</p>
          </>
        ) : (
          <>
            {" "}
            {products.map((product, index) => (
              <>
                <Link
                  to={`/home-page/product-detail/${product.id}`}
                  key={index}
                  style={{ textDecoration: "none", color: "#7355F7" }}
                >
                  <div className="relate-product-item d-flex ">
                    <img
                      src={product?.product_image}
                      style={{width: '100px', height: '100px'}}
                      alt=""
                    />
                    
                <div className="ms-3">
                <p className="relate-price">{product.title} </p>
                    <p>Giá: {product.price}</p>
                </div>
                  </div>
                </Link>
                <div key={index} className="tag-container mt-2">
                  {product.tags.map((tag, index) => (
                    <button
                      key={index}
                      className={`btn btn-outline tag badge ${tag.color}`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
                <hr className="bg-dark"></hr>
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RelateProduct;
