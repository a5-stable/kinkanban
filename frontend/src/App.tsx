import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import CommonLayout from "../src/components/layouts/CommonLayout"
import Home from "../src/components/pages/Home"
import SignUp from "../src/components/pages/SignUp"
import SignIn from "../src/components/pages/SignIn"
// import Kanban from './components/sections/Kanban';
import { ThemeProvider } from '@material-ui/core';

import logo from './logo.svg';
import './App.css';

import { getCurrentUser  } from './lib/api/auth';
import { User } from "../src/interfaces"

// グローバルで扱う変数・関数
export const AuthContext = createContext({} as {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  isSignedIn: boolean
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
})

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()

      if (res?.data.isLogin === true) {
        setIsSignedIn(true)
        setCurrentUser(res?.data.data)

        console.log(res?.data.data)
      } else {
        console.log("No current user!!!!!!!!!")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser])

  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn) {
        return children
      } else {
        return <Navigate to="/signin" />
      }
    } else {
      return <></>
    }
  }

  return (
    <>
      <Router>
        <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser}}>
          <CommonLayout>
            <Routes>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/projects/:id"
              />
              {/* <Route
                element={
                  <Private>
                    <Route path="/" element={<Home />} />
                  </Private>
                }
              >
              </Route> */}
            </Routes>
          </CommonLayout>
        </AuthContext.Provider>
      </Router>
    </>
  )
}

export default App
