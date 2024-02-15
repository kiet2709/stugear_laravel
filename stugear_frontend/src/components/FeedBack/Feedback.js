import { useState } from "react";
import CommentList from "./CommentSection/CommentList";
import "./Feedback.css";
import LeaveComment from "./LeaveComment/LeaveComment";
import RatingSection from "./RatingSection/RatingSection";
import { Link } from "react-router-dom";
const Feedback = ({ productId, isUnApproved }) => {
  const [key, setKey] = useState(0);
  return (
    <>
      <hr className="my-5"></hr>

      <RatingSection productId={productId} key={key + 1} />
      {localStorage.getItem("user_id") ? (
        <LeaveComment productId={productId} setKey={setKey} isUnApproved={isUnApproved} />
      ) : (
        <><div className="text-center my-5">
          <p>Vui lòng <Link to={"/login"}>đăng nhập</Link> để bình luận</p>
          </div></>
      )}
      <CommentList productId={productId} key={key} />
    </>
  );
};

export default Feedback;
