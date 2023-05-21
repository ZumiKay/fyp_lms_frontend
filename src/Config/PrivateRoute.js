
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({isSignedin , children}) => {
  if(isSignedin) {
    return children ? children: <Outlet/>
  }
  else {
   return <Navigate to={'/login'} replace/>
  } 
   
}

export default PrivateRoute

export const LoginRoute = ({isSignedin , children}) => {
  if(!isSignedin) return children
  else return <Navigate to={'/'} replace/>
}

export const LibrarianRoute = ({isSignedin, isLibrarian, children}) => {
  if(isSignedin && isLibrarian) {
    return children
  } else return <Navigate to={'/'} replace/>
}

export const LibrarianandHD = ({isSignedin , isLibrarian , isHD , children}) => {
  if(isSignedin && (isLibrarian || isHD)) {
    return children
  } else {
    return <Navigate to={'/'} replace/>
  }
}