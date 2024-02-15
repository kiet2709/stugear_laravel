import "./CommentList.css";

import Comment from "./Comment";
import ProductService from "../../../service/ProductService";
import { useEffect, useState } from "react";

import Loading from "../../../components/Loading/index";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination/Pagination";
import CustomPagination from "../../Pagination/Pagination";
const CommentList = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [totalProduct, setTotalProduct] = useState()
  const [key, setKey] = useState(0);
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const getCommentsByProductId = async (id) => {
    setLoading(true);
    const response = await ProductService.getCommentsByProductId(
      id,
      currentPage
    );
    console.log(response);
    if (response?.status === 500) {
      console.log("Something wentwrong");
    } else {
      setComments(response?.data);
      setTotalPage(response?.total_page);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCommentsByProductId(productId);
  }, [productId, currentPage, key]);

  return (
    <div>
      <div className="panel comment-list">
        {isLoading ? (
          <Loading />
        ) : comments.length===0 ? (
          <p className="text-center">Không có bình luận nào</p>
        ) :(
          <>
            {comments.map((comment) => (
              <Comment
                setKey={setKey}
                key={comment.id}
                comment={comment}
                productId={productId}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComment={{}}
              >
                {comment.sub_comment.map((subComment) => (
                  <Comment
                    key={subComment.id}
                    productId={productId}
                    comment={subComment}
                    setKey={setKey}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    parentComment={comment}
                    isSubComment={true}
                  />
                ))}
              </Comment>
            ))}
             <div className="mt-3 comment-pagination">
     
      </div>  
          </>
          
        )}
      </div>
      <div className="mt-5"><CustomPagination
          currentPage={currentPage}
          totalPage={totalPage}
          prevPage={prevPage}
          nextPage={nextPage}
          setCurrentPage={setCurrentPage}
          
        /></div>
    </div>
  );
};

export default CommentList;
