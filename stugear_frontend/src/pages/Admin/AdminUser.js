import { useEffect, useState } from "react";
import CategoryService from "../../service/CategoryService";
import Category from "../../components/Landing/Category";
import UserService from "../../service/UserService";
import Loading from "../../components/Loading";
import CustomModal from "../../components/Modal/Modal";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState()
  const [selectedStatus, setSelectedStatus] = useState()

  
  const handleStatusChange = async () => {
    
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUserId) {
        return { ...user, is_enable: selectedStatus };
      }
      return user;
    });
    console.log(updatedUsers)
    setUsers(updatedUsers);
    await UserService.updateUserStatus(selectedUserId, selectedStatus);
    
  };
  const loadData = async () => {
    setLoading(true);
    const response = await UserService.getAllUsers();

    if (response?.status === 500) {
      console.log("Something wentwrong");
    } else {
      setUsers(response);
    }
    setLoading(false);
    
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = () => {
    handleStatusChange(selectedStatus, selectedUserId)
    setShow(false)
  }
  const [show, setShow] = useState(false);
  const handleClose =() => {
    setShow(false)
  }
  return (
    <>
      <div style={{ height: "780px" }}>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Tên đăng nhập</th>
              <th scope="col">Email</th>
              <th scope="col">Tên</th>
              <th scope="col">Họ</th>
              <th scope="col">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {" "}
                {users?.map((user) => {
                  return (
                    <tr>
                      <th scope="row">{user.id}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.first_name}</td>
                      <td>{user.last_name}</td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={user.is_enable}
                          onChange={(e) => {
                            setSelectedUserId(user.id)
                            setSelectedStatus(e.target.value)
                            setShow(true)
                          }}
                        >
                          <>
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Chặn</option>
                          </>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
        <CustomModal handleSave={handleSave} handleClose={handleClose} show={show} heading={"Đổi trạng thái người dùng?"} body={"Bạn có muốn đổi trạng thái người dùng"}></CustomModal>
        
      </div>
    </>
  );
};
export default AdminUser;
