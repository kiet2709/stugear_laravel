import Category from '../Category'
import './index.css'
const CategoryList = ({ categories }) => {
  return (
        <section id="categories" className="values">
            <div className="container" data-aos="fade-up">
                <header className="section-header text-center">
                    <h2>Danh mục nổi bật</h2>
                    <p>Các danh mục nổi bật</p>
                </header>
                <div className="row">
                    {
                        categories.map(item => (
                            <Category key={item.id} category={item}/>
                        ))
                    }

                </div>

            </div>
        </section>
  )
}

export default CategoryList
