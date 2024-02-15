import "./Comment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowAltCircleDown,
  faCaretDown,
  faCaretUp,
  faClock,
  faGlobe,
  faMobile,
  faPencil,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductService from "../../../service/ProductService";

import { ToastContainer, toast } from "react-toastify";
import Vote from "../Vote/Vote";
import useAuth from "../../../hooks/useAuth"
import UserModal from "../../Profile/UserModal/UserModal";
const Comment = ({
  children,
  comment,
  productId,
  currentPage,
  setCurrentPage,
  setKey,
  parentComment,
  isSubComment,
}) => {
  const {user} = useAuth()
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyComment, setReplyComment] = useState({
    reply_on: comment?.owner_id,
    content: "",
    parent_id: parentComment?.id ? parentComment.id : comment.id,
  });
  const [isAdded, setAdded] = useState(false);
  const handleReplyClick = () => {
    setShowReplyInput(!showReplyInput);
  };
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const response = await ProductService.createCommentByProductId(
      productId,
      replyComment
    );
    if (response?.status === 500) {
      console.log("Something went wrong");
    } else {
      setAdded(true);
      toast.success("Trả lời bình luận thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setKey((prev) => prev + 1);
      setCurrentPage(currentPage);
    }
  };
  useEffect(() => {
    console.log(replyComment);
  }, [replyComment]);

  const handleChange = (e) => {
    setReplyComment({ ...replyComment, [e.target.name]: e.target.value });
  };

 

  return (
    <>
      <div className="panel-body media-block d-flex">
        
        {isSubComment !== true && (
          <Vote voteNum={comment.vote} commentId={comment?.id}/>
        )}
        
        <div className="mt-4">

        <UserModal userId={comment.owner_id}/>
        </div>
       
         
      
        <div className="media-body mt-4 ">
          <Link className="me-3">{comment.owner_name} </Link>
          {comment.rating ? (
            <>
              {" "}
              {[...Array(5)].map((_, index) => {
                let starColor = "";
                if (index < comment.rating) {
                  starColor = "#FFC107";
                }
                return (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    style={{ color: starColor }}
                  />
                );
              })}
            </>
          ) : (
            <></>
          )}

          <div className="mt-1 mb-3">
            <span className="text-muted">
              {" "}
              <FontAwesomeIcon icon={faClock} className="me-2"/>{comment.last_updated}
            </span>
          </div>
          <p>
            <Link style={{ textDecoration: "None" }}>
              {comment?.reply_on ? `@${comment.reply_on}` : ""}
            </Link>{" "}
            {comment.content}
          </p>
          <div>
  
            {user?.user_id ? (
              <>
                        <button
              className="btn  btn-sm btn-reply  "
              style={{marginLeft: '0px'}}
              onClick={(e) => handleReplyClick(e)}
            >
              Trả lời
            </button>
              </>
            ): 
            (
              <></>
            )}
  
          </div>
          <div className="reply-section">
            <hr />
            {showReplyInput && (
              <div className="panel-body">
                <textarea
                  className="form-control "
                  rows={4}
                  name="content"
                  placeholder="Bạn đang nghĩ gì?"
                  onChange={(e) => handleChange(e)}
                  value={replyComment?.content}
                />
                <button
                  className="btn btn-sm mt-3 btn-submit"
                  onClick={handleReplySubmit}
                >
                  Gửi
                </button>
              </div>
            )}
          </div>

          {/* insert sub comment here */}
          {children}
        </div>
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
      </div>
    </>
  );
};

export default Comment;
