import { faFacebookF, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const SocialContact = () => {
  return (
        <div className="socail-contact">

            <button type="button" className="btn btn-primary btn-floating mx-1">
                <FontAwesomeIcon style={{ width: 15 }} icon={faFacebookF} />
            </button>
            <button type="button" className="btn btn-danger btn-floating mx-1">
                <FontAwesomeIcon style={{ width: 15 }} icon={faGoogle} />
            </button>
            <button type="button" className="btn btn-dark btn-floating mx-1">
                <FontAwesomeIcon style={{ width: 15 }} icon={faGithub} />
            </button>
        </div>
  )
}

export default SocialContact
