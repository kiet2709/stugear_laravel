import Footer from '../../components/Footer/Footer'
import { Outlet } from 'react-router'
import Header from '../../components/Header'
import './index.css'
const MainLayout = () => {
  return (
        <>

            <Header sticky={true }/>
            <div className="body container my-5">
                <Outlet/>
            </div>
            <Footer/>
        </>

  )
}
export default MainLayout
