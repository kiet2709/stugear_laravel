import { NavLink, Link } from 'react-router-dom'

import Header from '../Header/index.js'
import './index.css'
import SocialContact from '../SocialContact/index.js'
const Navbar = () => {
  return (
        <div >
            <div style={{ backgroundColor: '#F1F3F7' }} className="py-3 border-bottom">
                <Header />
            </div>
            <nav style={{ backgroundColor: '#E1E4ED' }} className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="collapse navbar-collapse ">
                        <ul className="navbar-nav fw-bold">
                            <Link className="nav-item btn btn-outline-dark m-2 border-0">Trang chủ</Link>
                            <Link className="nav-item btn btn-outline-dark m-2 border-0">Thông tin</Link>
                            <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
                                <ul className="navbar-nav">
                                    <li className="nav-item dropdown">

                                        <span className="dropdown-toggle btn btn-outline-dark m-2 border-0" id="navbarDarkDropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                           Danh mục
                                        </span>
                                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                            <Link className="dropdown-item btn btn-outline-dark border-0">Sách</Link>
                                            <Link className="dropdown-item btn btn-outline-dark border-0">Đồ dùng</Link>
                                            <Link className="dropdown-item btn btn-outline-dark border-0">Khác</Link>
                                        </ul>
                                    </li>
                                </ul>
                            </div>

                            <Link className="nav-item btn btn-outline-dark m-2 border-0">Tìm kiếm</Link>
                        </ul>
                    </div>

                    <SocialContact/>
                </div>

            </nav>
        </div>

  )
}

export default Navbar
