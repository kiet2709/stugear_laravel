
import { Outlet } from 'react-router-dom'

import Footer from '../../components/Footer/Footer'
import "./Admin.css"
import AdminSideBar from '../../pages/Admin/AdminSideBar'
const AdminLayout = () => {
  return (
        <>
     
        <div className="wrapper d-flex align-items-stretch admin mb-5" style={{minHeight: '1100px'}}>
            <AdminSideBar/>
            <div className="body admin-body container mt-5 mx-5">
                <Outlet/>
                
            </div>
         
          
           </div>
           <Footer/>  
 
        </>
  )
}
export default AdminLayout
