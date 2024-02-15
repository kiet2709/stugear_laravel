import { createContext, useState } from 'react'
import PropTypes from 'prop-types';
const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}


// Add PropTypes validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider }
