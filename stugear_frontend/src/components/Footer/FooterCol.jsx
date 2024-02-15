import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'react-bootstrap'

const FooterCol = (props) => {
  return (
        <Col md={6} lg={3} className="footerLink">
            <h5>{props.title ? props.title : ''}</h5>
            {
                props.menuItems?.map(({ name, id }) => <Link to="/" key={id}><li>
 
                 {name}</li></Link>)
            }
            {props.children && props.children}
        </Col>
  )
}

export default FooterCol
