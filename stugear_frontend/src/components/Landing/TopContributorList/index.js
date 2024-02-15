import { useEffect, useState } from 'react'
import TopContributor from '../TopContributor'
import './index.css'
import UserService from '../../../service/UserService'
const TopContributorList = () => {

  const [contributors, setContributors] = useState([])
  const loadData = async () => {
    const response = await UserService.getTopContributors()
    setContributors(response?.data.slice(0, 4))
  }
  useEffect(() => {
    loadData()
  }, [])


  return (
        <section id="team" className="team mt-5">
            <div className="container" data-aos="fade-up">
                <header className="section-header text-center">
                    <h2>Người dùng uy tín</h2>
                    <p>Những người dùng có độ uy tín cao </p>
                </header>
                <div className="row mt-5 gy-4">
                    {
                        contributors.map(user => (
                            <TopContributor key={user.id} contributor={user}/>
                        ))
                    }

                </div>
            </div>
        </section>
  )
}

export default TopContributorList
