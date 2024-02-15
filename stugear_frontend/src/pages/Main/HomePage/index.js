import './index.css'
import Category from '../../../components/Category/Category'
import { useParams } from 'react-router'
import { useState, useEffect } from 'react'

import CategoryService from '../../../service/CategoryService'
import Loading from '../../../components/Loading'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setLoading] = useState(true)
  const { slug } = useParams()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

        const response = await CategoryService.getCategoriesById(slug)
        console.log(response)
        if (response?.status === 500) {
          console.log('Something wentwrong')
        } else {
          setCategories([response])
        }

      setLoading(false)
    }
    loadData()
  }, [slug])

  return (
    <>
      {isLoading
        ? (
        <Loading />
          )
        : (
        <>
          {categories.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </>
          )}
    </>
  )
}

export default HomePage
