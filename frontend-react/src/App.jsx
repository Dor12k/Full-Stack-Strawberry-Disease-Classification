
import './App.css'
import './index.css'; 
import Home from './pages/Home/Home';
import HomePage from './pages/HomePage';
import About from './pages/About/About';
import Index from './pages/Index/Index';
import Profile from './pages/Profile/Profile';
import Contact from './pages/Contact/Contact';
import Gallery from './pages/Gallery/Gallery';
import Article from './pages/Articles/Article';
import Articles from './pages/Articles/Articles';
import UserProvider from './context/UserContext';
import AuthProvider from './context/AuthContext';
import AddArticle from './pages/Articles/AddArticle';
import EditArticle from './pages/Articles/EditArticle';
import PublicRoute from './components/auth/PublicRoute';
import ScrollToTop from './components/utils/ScrollToTop';
import PrivateRoute from './components/auth/PrivateRoute';
import { createBrowserRouter, RouterProvider,} from "react-router-dom";




// Cancel warning message in console
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (/DOMNodeInserted/.test(args[0])) {
      return;
    }
    originalWarn(...args);
  };
}



// Creating a router configuration using `createBrowserRouter`
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute><ScrollToTop /> <Index /> </PublicRoute>,
  },
  
  {
    element: <PrivateRoute><ScrollToTop /> <HomePage /> </PrivateRoute>,
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
        path: "/articles/:slug",
        element: <Article />
      },
      {
        path: "/add-article",
        element: <AddArticle />
      },
      {
        path: "/edit-article/:slug",
        element: <EditArticle />
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
