import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../../service/AuthService'
import Loading from '../../../components/Loading'
import UserService from '../../../service/UserService'
import { useParams } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
const ResetPassword = () => {
  const {user, setUser} = useAuth()
  let {slug} = useParams()
  const [resetInfo, setResetInfo] = useState({
    email: slug,
    verify_code: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigator = useNavigate()
  const handleChange = (e) => {
    setResetInfo({ ...resetInfo, [e.target.name]: e.target.value })
  }

  const handleCheckPassword = () => {
    return resetInfo.password === resetInfo.confirmPassword
  }

  useEffect(() => {
    localStorage.clear()
    setUser("")
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (handleCheckPassword()) {
      setErrorMessage('')
      setLoading(true)
      const response = await AuthService.resetPassword(resetInfo)
      setLoading(false)
      if (response.status === 200) {
        navigator('/login')
      } else if (response.status === 400) {
        setErrorMessage(response?.data?.message)
      }
    } else {
      setErrorMessage({
        message: 'Mật khẩu xác nhận không khớp'
      })
    }
  }

  return (
        <div className="row my-3 justify-content-center w-100">
            <div className="col col-4 box-shadow p-5">

                <div className="social mt-5 align-items-center  justify-content-lg-start">
                    {loading && (
                        <Loading/>
                    )}
                    <p className="lead fw-normal mb-0 me-3">Xin chào! </p>
                    <p>Chúng tôi đã gửi mã PIN đến email của bạn</p>
                    <p className="mb-0 mt-2">Hãy đặt lại mật khẩu mới</p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} >

                    <div className="my-3 input-group flex-nowrap">
                        <span className="input-group-text"> <FontAwesomeIcon icon={faLock} /></span>
                        <input required type="text" className="form-control" placeholder="Nhập mã PIN" name="pin"
                        onInput={(e) => handleChange(e)}/>
                    </div>
                    <div className="my-3 input-group flex-nowrap">
                        <span className="input-group-text"> <FontAwesomeIcon icon={faLock} /></span>
                        <input required type="password" className="form-control" placeholder="Nhập mật khẩu mới"
                        name="password"
                        onInput={(e) => handleChange(e)}/>
                    </div>

                    <div className="my-3 input-group flex-nowrap">
                        <span className="input-group-text"> <FontAwesomeIcon icon={faLock} /></span>
                        <input required type="password" className="form-control" placeholder="Nhập lại mật khẩu mới"
                        name="confirmPassword"
                        onInput={(e) => handleChange(e)} />
                    </div>

                    {errorMessage && (
                            <div className="mt-4 alert alert-danger">{errorMessage}</div>
                    )}

                    <div className="my-4">
                        <button className="btn btn-dark text-white w-100 ">Đặt lại mật khẩu</button>
                        <div className="text-center mt-2">
                            <p className="small fw-bold mt-2 pt-1 mb-0">Chưa có tài khoản?
                                <a href="/register" className="link-danger"> Đăng ký</a>
                            </p>

                        </div>
                    </div>

                    <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
                    </div>
                    <div className="social mt-2  d-flex flex-row align-items-center  justify-content-lg-start">
                        <p className="lead fw-normal mb-0 me-3">Đăng nhập với: </p>
                        <button type="button" className="btn btn-secondary btn-floating mx-1">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </button>
                        <button type="button" className="btn btn-secondary btn-floating mx-1">
                            <FontAwesomeIcon icon={faGoogle} />
                        </button>
                    </div>

                </form>

            </div>
            <div className="col col-1">

            </div>
            <div className="col col-4 text-center">
                <h1 >Cập nhật mật khẩu</h1>
                <p className="font-italic text-muted mb-0">Hãy thay đổi mật khẩu của bạn</p>
                <img src="/assets/images/get-pass.gif" alt="" className="img-fluid" />

            </div>
        </div>
  )
}

export default ResetPassword
