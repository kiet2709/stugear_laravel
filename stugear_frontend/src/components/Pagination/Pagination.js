import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = ({ currentPage, totalPage, prevPage, nextPage, setCurrentPage, totalProduct }) => {
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
<>

{totalPage == 1 ? (
      <></>
    ): (
      <>
        <div className='row'>

        <div className='col-10'>
     <Pagination>
      <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
      {[...Array(totalPage).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => handlePageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={nextPage} disabled={currentPage === totalPage} />
   
    </Pagination>
     </div>

    <div className='col'>
      {totalProduct ? (
        <><p>Tổng: {totalProduct} sản phẩm</p></>
      ):
      (
        <></>
      )}
      
    </div>
        </div>
 
      </>
    )}
</>

  );
};

export default CustomPagination;
