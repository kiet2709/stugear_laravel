import { Outlet } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer/Footer"
import AccountSideBar from "../../components/Profile/AccountSideBar/AccountSideBar"
import { Container } from "react-bootstrap"

const PersonalLayout = ({children}) => {
    return (
        <>

        <Header sticky={true }/>
        <Container>
            <div className="row my-5">
                <div className="col-3">
                    <AccountSideBar/>
                </div>
                <div className="col card ms-2">
                    <Outlet/>
                </div>
            </div>
        </Container>
        <Footer/>
    </>
    )
}

export default PersonalLayout