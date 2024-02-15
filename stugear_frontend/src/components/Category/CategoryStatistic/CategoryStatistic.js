import "./CategoryStatistic.css";

const CategoryStatistic = ({ item }) => {
  return (
    <>
      <div className="d-flex">
        <div className="category-statistic mt-3 d-flex">
          <div className="text-center">
            <span>{item.total}</span>
            <p>Tổng cộng</p>
            
          </div>

          <div>
            <span className="vertical-line ms-4"></span>
          </div>
        </div>

        <div className="category-statistic mt-3 d-flex">
          <div className="text-center">
            <span>{item.sold}</span>
            <p>Đã bán</p>
          </div>
          <div>
            <span className="vertical-line ms-4"></span>
          </div>
        </div>

        <div className="category-statistic mt-3 d-flex">
          <div className="text-center">
            <span>{item.tag_total}</span>
            <p>Thể loại</p>
          </div>
          <div>
            <span className="vertical-line ms-4"></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryStatistic;
