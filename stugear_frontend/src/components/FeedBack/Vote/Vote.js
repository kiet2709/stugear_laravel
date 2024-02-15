import "./Vote.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import ProductService from "../../../service/ProductService";
import { useState } from "react";
const Vote =({voteNum, commentId}) => {
    const [vote, setVote] = useState(voteNum)
    const voteUp =async () => {
        await ProductService.voteCommentByCommentId(commentId, "+")
        setVote(prev => prev+1)
    }
  
    const voteDown = async() => {
        await ProductService.voteCommentByCommentId(commentId, "-")
        setVote(prev => prev-1)
    }
    return (
        <div className="vote-icon me-2">
        <Link>
        <FontAwesomeIcon icon="caret-up" onClick={() => voteUp()} className="col-md-12 vote-icon-up" /></Link>
        <span className="">{vote}</span>
        <Link>
        <FontAwesomeIcon icon="caret-down" onClick={() => voteDown()} className="col-md-12 vote-icon-up" /></Link>
      </div>
    )
}
export default Vote