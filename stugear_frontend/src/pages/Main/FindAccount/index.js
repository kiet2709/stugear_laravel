import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import { useState } from 'react'
import AuthService from '../../../service/AuthService'
import { useNavigate } from 'react-router-dom'
import Loading from '../../../components/Loading'
import OauthSection from '../../../components/OauthSection'
const FindAccount = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigator = useNavigate()
  const handleChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)
    const response = await AuthService.findUserByEmail(email)
    setLoading(false)
    if (response.status === 200) {
      navigator(`/member/reset-password/${email}`)
    } else if (response.status === 404) {
      setErrorMessage('Không tìm thấy tài khoản với email này')
    }
  }

  return (
        <div className="row my-3 justify-content-center w-100">
            <div className="col col-4 box-shadow p-4">

                <div className="social mt-5 align-items-center  justify-content-lg-start">
                    {loading && (
                        <Loading/>
                    )}
                    <p className="lead fw-normal mb-0 me-3">Xin chào! </p>
                    <p className="mb-0 mt-2">Hãy nhập email để lấy lại mật khẩu </p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} >

                    <div className="my-3 input-group flex-nowrap">
                        <span className="input-group-text"> <FontAwesomeIcon icon={faEnvelope} /></span>
                        <input required type="email" className="form-control" id="floatingInput" placeholder="Nhập địa chỉ email"
                        onInput={(e) => handleChange(e)}
                        value={email}/>
                    </div>
                    {errorMessage && (
                            <div className="mt-4 alert alert-danger">{errorMessage}</div>
                    )}

                    <div className="my-4">
                        <button className="btn btn-dark text-white w-100">Lấy lại mật khẩu</button>
                        <div className="text-center mt-2">
                            <p className="small fw-bold mt-2 pt-1 mb-0">Chưa có tài khoản?
                                <a href="/register" className="link-danger"> Đăng ký</a>
                            </p>

                        </div>
                    </div>

                    <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
                    </div>
                   <OauthSection/>

                </form>

            </div>
            <div className="col col-1">

            </div>
            <div className="col col-3 text-center">
                <h1 >Tìm tài khoản</h1>
                <p className="font-italic text-muted mb-0">Nhập email để đặt lại mật khẩu</p>
                <img src="/assets/images/get-pass.gif" alt="" className="img-fluid" />

            </div>
        </div>
  )
}

export default FindAccount
