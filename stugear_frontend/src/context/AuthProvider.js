import { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import UserService from "../service/UserService"
const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: localStorage.getItem("user_id"),
    access_token: localStorage.getItem("access_token"),
    refresh_token: localStorage.getItem("refresh_token"),
    roles: localStorage.getItem("roles"),
    username: localStorage.getItem("username"),
    user_image: localStorage.getItem("user_image"),
    balance: localStorage.getItem("balance")
  })


  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

// Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider }
