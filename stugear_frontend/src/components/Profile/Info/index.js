import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const Info = () => {
  return (
        <div id="account-info">
            <div id="account-social-links">
                <div className="card-body pb-2">
                    <form>

                      <h4 className="font-weight-bold pl-4">Địa chỉ</h4>

                      <div className="row">
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="address-card" /></span>
                                <input required type="text" className="form-control" placeholder="Số nhà"
                                    name="facebook"
                                />
                            </div>
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="address-card" /></span>
                                <input required type="text" className="form-control" placeholder="Thị Xã / Phường"
                                    name="google"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="address-card" /></span>
                                <input required type="text" className="form-control" placeholder="Tỉnh / Thành phố"
                                    name="facebook"
                                />
                            </div>
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="school" /></span>
                                <input required type="text" className="form-control" placeholder="Nơi công tác"
                                    name="google"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="address-card" /></span>
                                <input required type="text" className="form-control" placeholder="Địa chỉ cụ thể"
                                    name="facebook"
                                />
                            </div>

                        </div>

                        <hr className="border-dark m-3" />

                            <h4 className="font-weight-bold pl-4">Mạng xã hội</h4>

                        <div className="row">
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="facebook-f" /></span>
                                <input required type="text" className="form-control" placeholder="facebook"
                                    name="facebook"
                                />
                            </div>
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="google" /></span>
                                <input required type="text" className="form-control" placeholder="Email"
                                    name="google"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="instagram" /></span>
                                <input required type="text" className="form-control" placeholder="Instagram"
                                    name="instagram"
                                />
                            </div>
                            <div className="col my-3 input-group flex-nowrap">
                                <span className="input-group-text"> <FontAwesomeIcon icon="linkedin" /></span>
                                <input required type="text" className="form-control" placeholder="Linkedin"
                                    name="linkedin"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default Info
