import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Verify.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthService from '../../../service/AuthService'
import Loading from '../../../components/Loading'
import UserService from '../../../service/UserService'
import { ToastContainer, toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
const Verify = () => {
  const [pin, setPin] = useState({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSuccess, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [isLogin, setLogin] = useState(true)
  const navigator = useNavigate()
  let {slug} = useParams()
  const handleChange = (e) => {
    setPin(e.target.value)
  }

  const getCurrentUser = async() => {
    const response = await UserService.getCurrentUser()
    setEmail(response?.email)
  }
  useEffect(() => {
    if(localStorage.getItem("user_id")){
      getCurrentUser()
      setLogin(false)
    }else{
      setLogin(true)
      setEmail(slug)
    }
   
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)
   
    const result = await AuthService.sendVerifyPin(email, pin)
    setLoading(false)
    console.log(result)
    if (result.status === "success") {
      setSuccess(true)
      await toast.success("Xác thực tài khoản thành công!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if(isLogin === true){
        navigator("/login")
      }else{
        navigator("/member/upload")
      }
    
    } else{
      setSuccessMessage("")
      setErrorMessage(result?.data?.message)
      
    }
   
  }
  const sendVerifyEmail = async(e) => {
    e.preventDefault()
    setLoading(true)
    await UserService.sendVerifyEmail(email)
    setLoading(false)
    setErrorMessage("")
    setSuccessMessage("Gửi mã xác thực thành công")
  }
  return (
        <div className="row my-3 justify-content-center w-100">
            <div className="col col-4 box-shadow px-5">

                <div className="social mt-5 align-items-center justify-content-lg-start">
                    {loading && (
                        <Loading/>
                    )}
                    <p className="lead fw-normal mb-0 me-3">Xin chào! </p>
                    <p>Chúng tôi đã gửi mã PIN đến email của bạn</p>
                    <p className="mb-0 mt-2">Hãy xác thực tài khoản</p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} >

                    <div className="my-3 input-group flex-nowrap">
                        <span className="input-group-text"> <FontAwesomeIcon icon="lock" /></span>
                        <input required type="text" className="form-control" placeholder="Nhập mã PIN" name="pin"
                        onInput={(e) => handleChange(e)}/>
                    </div>

                    {errorMessage && (
                            <div className="mt-4 alert alert-danger">{errorMessage}</div>
                    )}
                     {successMessage && (
                            <div className="mt-4 alert alert-success">{successMessage}</div>
                    )}

                    <div className="my-4">
                        <button className="btn btn-dark text-white w-100 ">Xác thực tài khoản</button>
                        <button className="btn btn-dark text-white w-100 mt-3 " onClick={(e) => sendVerifyEmail(e)}>Gửi lại mã xác thực</button>
                    </div>

                </form>

            </div>
            <div className="col col-1">

            </div>
            <div className="col col-4 text-center">
                <h1 >Xác thực tài khoản </h1>
                <p className="font-italic text-muted mb-0">Hãy xác thực tài khoản của bạn</p>
                <img src="/assets/images/get-pass.gif" alt="" className="img-fluid" />

            </div>
            {isSuccess ? (
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
  )
}

export default Verify
