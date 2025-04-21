
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

import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Gallery from './pages/Gallery/Gallery';
import Articles from './pages/Articles/Articles';
import Home from './pages/Home/Home';

import HomePage from './pages/HomePage';




// Creating a router configuration using `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute> <Index /> </PublicRoute>,
  },
  
  {
    
    element: <PrivateRoute> <HomePage /> </PrivateRoute>,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      },
      {
        path: "/gallery",
        element: <Gallery />
      },
      {
        path: "/articles",
        element: <Articles />
      },
      {
        path: "/profile",
        element: <Profile />
      },
    ]
  }
  
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
