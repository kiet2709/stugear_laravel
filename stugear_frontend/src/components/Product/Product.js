import {
  faSearch,
  faBookmark,
  faMessage
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, InputGroup } from 'react-bootstrap'
import { useState } from 'react'
import './Product.css'
import { Link } from 'react-router-dom'
const Product = ({ product }) => {
  return (
    <tr key={product.id}>
      <td className="align-middle">
        <Link
          to={"/home-page/product-detail/"+product.id}
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <img src={product.product_image} alt="/assets/images/book-thumbnail.jpg" className="hover-effect small-image" />
          <span>{product.title}</span>
        </Link>
      </td>
      <td className="align-middle">
        <div className="tag-container">
        {            product.tags.map((tag, index) => (
              <button
                key={index}
                className={`btn btn-outline tag badge ${tag.color}`}
              >
                <Link style={{textDecoration: 'None', color:'White'}} to={`/search/?tag=${tag.id}`}>{tag.name}</Link>
                
              </button>
            ))}
        </div>
      </td>

      <td className="align-middle text-center">
        <Link style={{ textDecoration: 'none' }} className="badge bg-primary ">
          <FontAwesomeIcon icon={faMessage} /> {product.comment_count}
        </Link>
      </td>
      <td className="align-middle">
        <p className="m-0 ms-3">{product.price}</p>
      </td>

      <td className="align-middle">
        <span>{product.last_updated}</span>
      </td>
    </tr>
  )
}

export default Product
