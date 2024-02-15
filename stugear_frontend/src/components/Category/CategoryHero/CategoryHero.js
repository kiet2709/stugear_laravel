    
import { Carousel } from 'react-bootstrap'
import './CategoryHero.css'

const CategoryHero = ({ category }) => {
  const customCarouselStyles = {
    controlPrevIcon: {
      position: "absolute",
      top: "30%",
    
      zIndex: 1,

    },
    controlNextIcon: {
      position: "absolute",
      top: "30%",
      zIndex: 1,
    },
  };
  const carouselCaptionStyles = {
    background: "rgba(0, 0, 0, 0.5)", // Add background overlay
    color: "#fff", // Text color
    textAlign: "center",
    padding: "25px",
    top: "50%",
    maxHeight: '115px',
  };
  return (
    <div className="category-hero">
    <Carousel prevIcon={<span style={customCarouselStyles.controlPrevIcon} className="carousel-control-prev-icon" />}
     nextIcon={<span className="carousel-control-next-icon" style={customCarouselStyles.controlNextIcon}/>}>
      {/* You can add multiple slides here */}
      <Carousel.Item>
        <img
          src={category.image}
          alt="Category Hero 0"
          className="d-block w-100"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/assets/images/carousel1.jpg"
          alt="Category Hero 1"
          className="d-block w-100"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/assets/images/carousel2.png"
          alt="Category Hero 2"
          className="d-block w-100"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="/assets/images/carousel3.jpg"
          alt="Category Hero 3"
          className="d-block w-100"
        />
      </Carousel.Item>
    </Carousel>

    <div className="category-hero-text " style={carouselCaptionStyles}>
      <p className=''>{category.description}</p>
    </div>
 
  </div>
  )
}

export default CategoryHero
