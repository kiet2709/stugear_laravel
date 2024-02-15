import MainLayout from '../layouts/MainLayout/index.js'
import AdminLayout from '../layouts/AdminLayout/Admin.js'
import Login from '../pages/Main/Login/index.js'
import Register from '../pages/Main/Register/index.js'
import ResetPassword from '../pages/Main/ResetPassword/index.js'
import FindAccount from '../pages/Main/FindAccount/index.js'
import { Navigate, Route, useRoutes } from 'react-router-dom'
import LandingPage from '../pages/Main/LandingPage/index.js'
import Info from '../pages/Main/Info/index.js'
import Contact from '../pages/Main/Contact/index.js'
import HomePage from '../pages/Main/HomePage/index.js'
import ProductPage from '../pages/Main/ProductPage/ProductPage.js'
import HomeLayout from '../layouts/HomeLayout/HomeLayout.js'
import SearchPage from '../pages/Main/SearchPage/SearchPage.js'
import PersonalLayout from '../layouts/PersonalLayout/PersonalLayout.js'
import General from '../components/Profile/General/index.js'
import Wishlist from '../components/Profile/Wishlist/Wishlist.js'
import ErrorPage from '../pages/Main/ErrorPage/ErrorPage.js'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.js'
import UploadProduct from '../pages/Main/UploadProduct/UploadProduct.js'
import MyProduct from '../components/Profile/MyProduct/MyProduct.js'
import Verify from '../pages/Main/Verify/Verify.js'
import AdminUser from "../pages/Admin/AdminUser.js"
import AdminProduct from "../pages/Admin/AdminProduct.js"
import useAuth from '../hooks/useAuth.js'
import MyWallet from '../components/Profile/MyWallet/MyWallet.js'
import CheckoutPage from '../pages/Main/Checkout/index.js'
import MyOrder from '../components/Profile/MyOrder/MyOrder.js'
import OrderPage from '../pages/Main/OrderPage/index.js'
import PaymentSucess from '../pages/Main/PaymentSucess/PaymentSucess.js'
import MySell from '../components/Profile/MySell/MySell.js'
import AdminReport from '../pages/Admin/AdminReport.js'
import AdminWithdraw from '../pages/Admin/AdminWithdraw.js'
import AdminOrder from '../pages/Admin/AdminOrders.js'
import AdminCategory from '../pages/Admin/AdminCategory.js'
function useRouteElements () {

  const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    return user?.roles?.includes("ADMIN") ? children : <Navigate to="/landing-page" />;
  };
  
  const RejectRoute = ({ children }) => {
    const { user } = useAuth();
     return user?.roles?.includes("ADMIN") ? <Navigate to="/admin" /> :
     user?.roles?.includes("USER") ? <Navigate to="/landing-page" /> : children;
  };
  
  const routeElements = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <LandingPage />
        },
        // Other routes...
      ]
    },
    {
      path: '',
      element: <HomeLayout title={"Trang chủ"}/>,
      children: [
        {
          path: '/home-page/category/:slug',
          element: <HomePage/>
        },
      ]
    },
    {
      path: '',
      element: <HomeLayout title={"Trang chủ"} sub_title={"Sản phẩm"}/>,
      children: [
        {
          path: '/home-page/product-detail/:slug',
          element: <ProductPage/>
        },
      ]
    },
    {
      path: '',
      element: <ProtectedRoute><PersonalLayout/></ProtectedRoute>,
      children: [
        {
          path: '/member/wishlist',
          element: <Wishlist/>
        },
        {
          path: '/member/general',
          element: <General/>
        },
        {
          path: '/member/my-product',
          element: <MyProduct/>
        },
        {
          path: '/member/my-sell',
          element: <MySell/>
        },
        {
          path: '/member/wallet',
          element: <MyWallet/>
        },
        {
          path: '/member/order',
          element: <MyOrder/>
        },
      ]
    },
    {
      path: '',
      element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
      children: [
        {
          path: '/member/upload/:slug?',
          element: <UploadProduct/>
        },
        {
          path: '/member/checkout/:slug',
          element: <CheckoutPage/>
        },
        {
          path: '/member/order-detail/:slug',
          element: <OrderPage/>
        },
      ]
    },

    {
      path: '',
      element: <RejectRoute><MainLayout/></RejectRoute>,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        },
        {
          path: '/member/reset-password/:slug',
          element: <ResetPassword />
        },
        {
          path: 'find-account',
          element: <FindAccount />
        },
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '/landing-page',
          element: <LandingPage/>
        },
   
        {
          path: 'info',
          element: <Info/>
        },
        {
          path: 'contact',
          element: <Contact/>
        },
        {
          path: 'search/:slug?',
          element: <SearchPage/>
        },
        {
          path: "internal-error",
          element: <ErrorPage status="500" message={"Có lỗi xảy ra"}
          title={"Lỗi hệ thống"} />
        },
        {
          path: '*',
          element: <ErrorPage status="404" message={"Không tìm thấy trang bạn yêu cầu"}
          title={"Không tìm thấy trang"} />
        },
        {
          path: '/verify/:slug?',
          element: <Verify />
        },
      ]
    },
  
    {
      path: '',
      element: <AdminRoute><AdminLayout/></AdminRoute>,
      children: [
        {
          path: '/admin/',
          element:  <AdminCategory/>
        },
        {
          path: '/admin/users',
          element: <AdminUser/>
        },
        {
          path: '/admin/products',
          element: <AdminProduct/>
        },
        {
          path: '/admin/reports',
          element: <AdminReport/>
        },
        {
          path: '/admin/withdraws',
          element: <AdminWithdraw/>
        },
        {
          path: '/admin/orders',
          element: <AdminOrder/>
        },
        {
          path: "/admin/categories",
          element:<AdminCategory/>
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
      children: [
        {
          path: '/payment-success/',
          element:  <PaymentSucess/>
        }
      ]
    }
  ])
  return routeElements
}

export default useRouteElements
