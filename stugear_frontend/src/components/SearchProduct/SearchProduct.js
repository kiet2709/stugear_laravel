import { useEffect, useState } from "react";
import ProductCard from "../Product/ProductCard/ProductCard";
import "./SearchProduct.css";
import SearchSideBar from "./SearchSideBar";
import ProductService from "../../service/ProductService";
import CategoryService from "../../service/CategoryService";
import CustomPagination from "../Pagination/Pagination";
import Loading from "../Loading";
import { Link } from "react-router-dom";
const SearchProduct = () => {


  const [products, setProducts] = useState([{}])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState()
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };


  return (
    <>
      <div className="search-product my-5">
        <div className="row">
          <div className="col-3 filter">
            <SearchSideBar setProducts={setProducts} setTotalPage={setTotalPage} currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            setLoading={setLoading}/>
          </div>
          <div className="col search-result">
           {isLoading === true ? (
            <Loading/>
           ) : (
            <div className="row">
            {products?.length === 0 && (
              <p className="text-center">Không có sản phẩm nào</p>
            )}
            {products?.map((product, index) => (
               <>
                <div className="col-4 my-4 search-item">
                <Link  style={{textDecoration: 'None'}} to={`/home-page/product-detail/${product.id}`}>
                 <ProductCard key={index} product={product} />
                 </Link>
                </div>
               </>
                  
                 ))}
            </div>
     
           )}
     
     <div  className="mt-4 ">
        <CustomPagination
            currentPage={currentPage}
            totalPage={totalPage}
            prevPage={prevPage}
            nextPage={nextPage}
            setCurrentPage={setCurrentPage}
          />
      </div>
           
          </div>

        </div>
  
      </div>
    </>
  );
};

export default SearchProduct;
