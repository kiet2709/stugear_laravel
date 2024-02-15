import CategoryFilter from "./CategoryFilter/CategoryFilter";
import "./Category.css";
import CategoryHero from "./CategoryHero/CategoryHero";
import CategoryStatistic from "./CategoryStatistic/CategoryStatistic";
import Product from "../Product/Product"
import { useEffect, useState } from "react";
import CategoryService from "../../service/CategoryService";
import Loading from "../Loading";
import CustomPagination from "../Pagination/Pagination";


const Category = ({ category }) => {
  const [statistic, setStatistic] = useState({});
  const [isStaticLoading, setStaticLoading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState()
  const [totalProduct, setTotalProduct] = useState()
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const loadStatistic = async () => {
    const reponse = await CategoryService.getStatisticByCategoryId(category.id);

    if (reponse?.status === 500) {
      console.log("Categories: Something went wrong");
    } else {
      setStatistic(reponse);
    }
  };


  useEffect(() => {
    setStaticLoading(true);
    loadStatistic();
    setStaticLoading(false);
  }, []);

  return (
    <>
      <div className="category">

        <CategoryHero category={category}  key={category.id} setLoading={setLoading} setTotalPage={setTotalPage} category_id={category?.id} currentPage={currentPage} setCurrentPage={setCurrentPage} setProducts={setProducts} />

        {isStaticLoading ? <Loading /> : <CategoryStatistic item={statistic} />}

        <div className="my-4 category-filter">
          <CategoryFilter setTotalProduct={setTotalProduct}  key={category.id} setLoading={setLoading} setTotalPage={setTotalPage} category_id={category?.id} currentPage={currentPage} setCurrentPage={setCurrentPage} setProducts={setProducts}/>
        </div>

        <div>
      <table className="table table-borderless table-striped table-hover">
        <thead>
        <tr>
                <th scope="col" width="25%" className="text-center">Sản phẩm</th>
                <th scope="col" width="15%" className="text-center">Thẻ</th>
                <th scope="col" className="text-center" width="8%">Bình Luận</th>
                <th scope="col"  className="text-center" width="8%" >Giá</th>
                <th scope="col" width="7%">Ngày đăng</th>
              </tr>
        </thead>
        <tbody>
        <>
  {isLoading ? (
    <Loading />
  ) : (
    <>
      {products?.data?.length === 0 ? (
        <p className="text-center my-4">Không tìm thấy sản phẩm</p>
      ) : (
        <>
          {products?.data?.map((product, index) => (
            <Product key={index} product={product} />
          ))}
        </>
      )}
    </>
  )}
</>

        </tbody>
      </table>
      <div  className="mt-4 ">
        <CustomPagination 
            currentPage={currentPage}
            totalPage={totalPage}
            prevPage={prevPage}
            nextPage={nextPage}
            setCurrentPage={setCurrentPage}
            totalProduct={totalProduct}
          />
      </div>
    </div>
      </div>
    </>
  );
};

export default Category;
