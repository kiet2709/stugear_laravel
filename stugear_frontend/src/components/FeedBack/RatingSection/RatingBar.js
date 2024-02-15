import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './RatingBar.css'

const RatingBar = ({ rating, total }) => {
  const percentage = (rating.quantity / total) * 100
  const stars = []

  for (let i = 0; i < rating.rate; i++) {
    stars.push(<FontAwesomeIcon key={i} icon="star" style={{ color: '#FFC107' }} />)
  }

  return (
    <tr>
        <td>
          {stars}
        </td>
        <td className="progress-bar-container">
          <div className="fit-progressbar fit-progressbar-bar star-progress-bar">
          <div className="fit-progressbar-background">
            <span className="progress-fill" style={{ width: `${percentage}%` }} />
          </div>
          </div>
        </td>
        <td className="star-num">({rating.quantity})</td>
      </tr>
  )
}

export default RatingBar
