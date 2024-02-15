import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FooterCol from './FooterCol'
import './Footer.css'
import { usefulLink, ourServices, otherLinks, footerInfo } from './FooterData'
import FooterInfo from './FooterInfo'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
        <section className='row footer'>
            <Row className="col-md-11 mx-auto">
                <Row className="align-items-center footerInfo">
                    {
                        footerInfo.map(data => <FooterInfo data={data} key={data.id}/>)
                    }
                </Row>
                <Col md={6} lg={3} className="fAboutUs">
                    <h5>VỀ CHÚNG TÔI</h5>
                    <span className="animate-border"></span>
                    <p className="aboutUsDes">Giải pháp hiện đại cho việc trao đổi tài liệu học tập.</p>
                    <ul className="socialIcons">
                        <li>
                            <Link to="/" >
                                <FontAwesomeIcon icon="facebook"/>
                                </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <FontAwesomeIcon icon="twitter"/>
                                </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <FontAwesomeIcon icon="instagram"/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <FontAwesomeIcon icon="linkedin"/>
                            </Link>
                        </li>
                    </ul>
                </Col>
                <FooterCol key="2" menuItems={usefulLink} title="LINK HỮU ÍCH"/>
                <FooterCol key="3" menuItems={ourServices} title="DỊCH VỤ CỦA CHÚNG TÔI"/>
                <FooterCol key="4" menuItems={otherLinks} title="LINK KHÁC"/>
            </Row>
            <p className="copyRight">Copyright &copy; 2023 <span className="fHighlight">Khải & Kiệt</span>. All rights reserved.</p>
        </section>
  )
}

export default Footer
