import { Link } from "react-router-dom"

const Category = ({ category }) => {
    console.log(category)
    return (
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay={200}>
        <div className="box" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            <img
              src={category.image}
              alt=''
              className="img-fluid"
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
          </div>
          <div style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{category.name}</h3>
            <p>{category.description}.</p>
            <Link to={`/home-page/category/${category.id}`} className="btn btn-primary ml-auto">Xem thêm</Link>
          </div>
        </div>
      </div>
    )
  }
  
  export default Category
  