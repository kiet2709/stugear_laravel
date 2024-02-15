import SubMenu from './SubMenu'
import './SideBar.css'
import { useParams } from 'react-router-dom'
const SideBar = ({ categories }) => {
  const { slug } = useParams()


  return (
    <>
      <nav className="sidebar card sticky-top   ">
        <ul>


            <>
            { categories.map((item) => (
              <SubMenu
                key={item.id}
                category={item}
                buyActive={item.id == slug}
                sellActive={false}
              />
            ))}
            </>

        </ul>
      </nav>
    </>
  )
}
export default SideBar
