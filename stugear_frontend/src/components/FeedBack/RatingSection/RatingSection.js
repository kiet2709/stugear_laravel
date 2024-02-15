import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import RatingBar from './RatingBar'
import './RatingSection.css'
import {
  faStar,
  faPeopleArrows,
  faPeopleCarry,
  faPeopleLine,
  faPerson
} from '@fortawesome/free-solid-svg-icons'

import Loading from "../../Loading/index"
import { useEffect, useState } from 'react'
import ProductService from '../../../service/ProductService'

const RatingSection = ({productId}) => {

  const [ratings, setRatings] = useState([])
  const [isLoading, setLoading] = useState(true)

  const getRatingByProductId = async(id) => {
    setLoading(true)
    const response = await ProductService.getRatingByProductId(id)
    if (response?.status === 500) {
      console.log('Something wentwrong')
    } else {
      setRatings(response)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRatingByProductId(productId)
  },[productId])


  return (
    <>
      <div id="reviews" className="review-section my-5">
        <h3 className='text-center my-5'>Đánh giá</h3>
        {isLoading ? (
          <Loading/>
        ): (
          <div className="row">
          <div className="col-3 text-center">

            <h1 className="rating-num">{ratings.average}</h1>
            <span>Trên 5.0</span>
            <div className="rating ">
              {[...Array(5)].map((_, index) => {
                let starColor = ''
                if (index < Math.floor(ratings.average)) {
                  starColor = '#FFC107'
                }
                return (
                  <FontAwesomeIcon
                    key={index}
                    icon={faStar}
                    style={{ color: starColor }}
                  />
                )
              })}
            </div>
          </div>
          <div className="col">
            <table className="stars-counters">
              <tbody>
                {ratings?.rate?.map((rating) => (
                  <RatingBar
                    key={rating.id}
                    rating={rating}
                    total={ratings.total}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

      </div>
    </>
  )
}

export default RatingSection
