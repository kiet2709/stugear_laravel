import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
const TopContributor = ({ contributor }) => {
  return (

        <div className="col-lg-3 col-md-6 d-flex align-items-stretch" data-aos="fade-up" data-aos-delay={400}>
            <div className="member">
                <div className="member-img">
                    <img src={`http://localhost:8000/api/users/${contributor.id}/images`} className="img-fluid" alt 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}/>
                    <div className="social" style={{ backgroundColor: 'transparent' }}>
                    <Link to={contributor?.social_link} target="_blank" className=" btn btn-secondary btn-floating my-1 d-block" style={{backgroundColor: 'yellow'}}>
                            <FontAwesomeIcon style={{ width: 15}} icon="message" />
                        </Link>
        
     

                    </div>
                </div>
                <div className="member-info">
                    <h4>{contributor.name}</h4>
                    <span>SĐT: {contributor.phone_number}</span>
                    <p>{contributor.full_address}</p>
                </div>

            </div>
        </div>

  )
}

export default TopContributor
