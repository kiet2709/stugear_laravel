import { Link } from "react-router-dom"
import "./ErrorPage.css"

const ErrorPage =({status, title, message}) => {
    return (
        <div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>Oops!</h1>
			</div>
			<h2>{status} - {title}</h2>
			<p>{message}.</p>
			<Link to={"/home-page/category/1"}>Trở về trang chủ</Link>
		</div>
	</div>

    )
}

export default ErrorPage