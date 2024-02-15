import { Link } from 'react-router-dom'
import UserModal from '../Profile/UserModal/UserModal'
import './ChatSection.css'
import { useEffect, useState } from 'react'
import UserService from '../../service/UserService'

const ChatSection = ({ product }) => {

  const [owner, setOwner]  = useState("")

  const getUserById = async (userId) => {
    const response = await UserService.getUserById(userId)

    setOwner(response[0])
  }
  useEffect(() => {
    getUserById(product?.owner_id)
  }, [])
  return (
    <>
      <div className="card">
        <div className="card-body chat-section-body">
          <p>Nhắn với <UserModal userId={product?.owner_id}/><b> {product.owner_name}</b> ngay bây giờ</p>
          <form method="POST" action="#">
            <textarea
              className="form-control input-group"
              name="content"
              id="content"
              rows={8}
              required
              placeholder="Nhắn tin ở đây..."
              defaultValue={`Xin chào ${product.owner_name},\n\nBạn còn món đồ này không? Tui muốn mua vài món từ bạn. Xin hãy nhắn lại cho tui biết\n\nCảm ơn,\nNguyen`}
            />
                   <Link to={owner?.social_link} target="_blank" className="btn text-white input-group custom-btn">
                Gửi tin nhắn
              </Link>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChatSection
