
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/Store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Data from "./pages/Data";
import HomeLayout from "./pages/HomeLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import { ToastContainer } from "react-toastify";
import SharePage from "./pages/Share";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminFiles from "./pages/admin/AdminFiles";


function App(){
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },

      ],
    },
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/home",
          element: <Data />,
        },
      ],
    },
    {path: "/share/:code",
    element:<SharePage/>
    },
    {path: "/profile",
      element:<Profile/>
    },
    {path: "/admin",
      element:<AdminPanel/>
      },
      {path: "/admin/files/:code",
        element:<AdminFiles/>
        },
      
    
  ]);

  return (
    //----- Provide the Redux store to the entire app------------>
    <Provider store={store}>
      {/* Use the custom router for navigation */}
      <RouterProvider router={router} />
      {/* Toast notification container for displaying messages */}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Provider>
  );
}

export default App;