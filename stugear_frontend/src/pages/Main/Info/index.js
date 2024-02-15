
import { Container } from "react-bootstrap";
import "./index.css";
import ProductService from "../../../service/ProductService";


const Info = () => {
  const handleClick = async (e, selectedFile) => {
    e.preventDefault();

    try {
      const response = await ProductService.uploadImageByProductId(1, selectedFile);
      console.log("Success");
      console.log(response);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleClick(e, selectedFile);
  };

  return (
    <Container>
      <p>Info</p>
    </Container>
  )
}

export default Info
