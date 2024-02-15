import "./index.css";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section id="hero" className="hero d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex flex-column justify-content-center">
          <h1 data-aos="fade-up">Giải pháp hiện đại cho việc trao đổi tài liệu học tập</h1>
<h2 data-aos="fade-up" data-aos-delay={400}>Đội ngũ hỗ trợ trao đổi tài liệu học</h2>

            <div data-aos="fade-up" data-aos-delay={600}>
              <div className="text-center text-lg-start mt-3">
                {!localStorage.getItem("user_id") && (
 <button className="btn btn-primary">
 <Link style={{ textDecoration: "none" }} to={"/register"}>
   <span className="text-white">Đăng ký</span>
 </Link>
</button>
                )}
               
              </div>
            </div>
          </div>
          <div
            className="col-lg-6 hero-img"
            data-aos="zoom-out"
            data-aos-delay={200}
          >
            <img
              src="/assets/images/hero-img.png"
              className="img-fluid"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
