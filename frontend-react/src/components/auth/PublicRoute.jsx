

import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'


// Sign out permission
const PublicRoute = ({children}) => {

  const { isLoggedIn } = useContext(AuthContext)


  return !isLoggedIn ? (
    children
  ) : (
    <Navigate to='/home' />
  )
}

export default PublicRoute