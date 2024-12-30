import { useState } from 'react'
import './App.css'
import { Button } from "./components/ui/button.tsx"
import { HStack, VStack } from "@chakra-ui/react"
import { Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Register from './pages/register/register.tsx'
import Login from './pages/login/login.tsx'
import Forgot from './pages/forgot_pass/forgot_pass.tsx'
import Renew from './pages/renew_pass/renew_pass.tsx'
// import Main from './pages/main_page/main.tsx'
import PrivateRoute from './privateroute.tsx'
import "./main_page.css"
import Sidebar from './base_page/sidebar.tsx'
import Posts from './base_page/post.tsx'
import Profile from './base_page/profile.tsx'
import { Separator } from "@chakra-ui/react"
import SearchPage from './base_page/search.tsx'
import FollowPage from './base_page/follows.tsx'
import ProfileDetail from './base_page/profile_detail.tsx'
import PrivateLayout from './pages/layout/PrivateRoute.tsx'
import React,
{
  useEffect
} from 'react';
import { UserProvider } from '@/userContext';
import { Toaster } from "@/components/ui/toaster"
function App() {
  const [count, setCount] = useState(0)
  const isAuthenticated = true;
//   const UseLocalStorage = (key, initialValue) => {
//     const [value, setValue] = useState(() => {
//         const storedValue = localStorage.getItem(key);
//         return storedValue ?
//             JSON.parse(storedValue) :
//             initialValue;
//     });

//     useEffect(() => {
//         localStorage.setItem(key, JSON.stringify(value));
//     }, [key, value]);

//     return [value, setValue];
// };
  return (
    <>
      <div>
        <UserProvider>
          <Router>
            <Toaster />
            <Routes>
              
              <Route path='/' element={<Register />} />
              
              <Route path='/login' element={<Login />} />
              <Route path='/forgot' element={<Forgot />} />
              <Route path='/renew' element={<Renew />} />
              {/* <Route path='/zustand' element={< />} /> */}
              {/* Private Routes */}
              <Route
                path="/main/*"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <PrivateLayout />
                  </PrivateRoute>
                }
              />
              
            </Routes>
          </Router>
        </UserProvider>
      </div>
    </>
  )
}

export default App
