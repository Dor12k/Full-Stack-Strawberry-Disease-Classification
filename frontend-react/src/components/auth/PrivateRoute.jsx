

import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


// Sign in permission
const PrivateRoute = ({children}) => {

  const { isLoggedIn } = useContext(AuthContext)

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to='/' />
  )
}

export default PrivateRoute

