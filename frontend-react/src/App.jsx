
import './App.css'
import './index.css'; 
import Index from './pages/Index/Index';
import Profile from './pages/Profile/Profile';
import UserProvider from './context/UserContext';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthProvider from './context/AuthContext';
import PublicRoute from './components/auth/PublicRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import { createBrowserRouter, RouterProvider,} from "react-router-dom";



// Creating a router configuration using `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute> <Index /> </PublicRoute>,
  },
  {
    path: "/dashboard",
    element: <PrivateRoute> <Dashboard /> </PrivateRoute>, 
  },
  {
    path: "/profile",
    element: <PrivateRoute> <Profile /> </PrivateRoute>, 
  },
  
]);


function App() {

  // Providing the router configuration to the app using RouterProvider
  return (

     <UserProvider>

      <AuthProvider> {/* Wrap RouterProvider with AuthProvider */}

        
            <RouterProvider router={router} />
        
        
      </AuthProvider>
    
    </UserProvider>
    
  )

}


// Exporting the App component as the default export
export default App
