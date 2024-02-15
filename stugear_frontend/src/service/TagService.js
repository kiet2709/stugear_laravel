import axios from 'axios'
import { axiosPrivate } from '../api/axios'

const TAG_URL = 'http://localhost:8000/api/tags'
class TagService {
    getAllTags(){
        return axios
            .get(TAG_URL+"?page=1&limit=200")
            .then((response) => response?.data?.data)
            .catch((error) => error?.response)
      }
      
  createTags(tags){
    return axiosPrivate.post(TAG_URL, {
        names: tags
    })
    .then((response) => response?.data?.data)
    .catch((error) => error?.response);
  }
}

export default new TagService()

