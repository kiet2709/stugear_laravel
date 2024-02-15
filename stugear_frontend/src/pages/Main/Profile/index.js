import General from '../../../components/Profile/General'
import Info from '../../../components/Profile/Info'
import './index.css'
import { useState } from 'react'
const Profile = () => {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <General />
      case 'info':
        return <Info />
        // Add cases for other tabs if needed
      default:
        return null
    }
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  return (
        <div className="container profile-container light-style  ">
            <h4 className="font-weight-bold py-3 mb-4">
                Thông tin tài khoản
            </h4>
            <div className="card overflow-hidden">
                <div className="row no-gutters row-bordered row-border-light">
                    <div className="col-md-4 pt-0">
                        <div className="list-group list-group-flush account-settings-links">
                        <a className={`list-group-item list-group-item-action ${activeTab === 'general' ? 'active' : ''}`} onClick={() => handleTabClick('general')}>Thông tin cá nhân</a>
                            <a className={`list-group-item list-group-item-action ${activeTab === 'info' ? 'active' : ''}`} onClick={() => handleTabClick('info')}>Thông tin liên hệ</a>
                            <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-notifications">Sản phẩm</a>
                            <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-change-password">Đổi mật khẩu</a>
                            <a className="list-group-item list-group-item-action" data-toggle="list" href="#account-change-password">Đăng xuất</a>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="tab-content">
                        {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>

        </div>

  )
}
export default Profile
