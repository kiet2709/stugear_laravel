import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import useAuth from "../../../hooks/useAuth";
import UserService from "../../../service/UserService";
function UserAvatar({userInfo}) {
  const [isLoading, setLoading] = useState(false);
  let { user, setUser } = useAuth();
  const handleFileChange = async (e) => {
    await UserService.uploadImage(user?.user_id, e.target.files[0]);
    setUser({
      ...user,
      user_image:
        `http://localhost:8000/api/users/${user?.user_id}/images/` +
        `?timestamp=${new Date().getTime()}`,
    });


  
  };

  return (
    <>
      <aside className="user-info-wrapper">
        <div
          className="user-cover"
          style={{
            backgroundImage: "url(https://bootdey.com/img/Content/bg1.jpg)",
          }}
        >
          <div
            className="info-label"
            data-toggle="tooltip"
            title
            data-original-title="You currently have 290 Reward Points to spend"
          >
            <FontAwesomeIcon icon="medal" /> {userInfo?.reputation} điểm uy
            tín
          </div>
        </div>
        <div className="user-info">
          <div className="user-avatar">
            <label>
              <div className="edit-avatar">
                {" "}
                <FontAwesomeIcon icon="file-upload" />
              </div>
              <input
                type="file"
                className="account-settings-file"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e)}
              />
            </label>
            {isLoading ? (
              <Loading />
            ) : (
              <img src={user?.user_image} alt="User" className="hover-effect" />
            )}
          </div>
          <div className="user-data">
            <h4>{user.username}</h4>
            <span>Tham gia vào tháng 6, 2017</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default UserAvatar;
