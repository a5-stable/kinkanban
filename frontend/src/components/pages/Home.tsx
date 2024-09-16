import React, { useContext, useState, useEffect } from "react"
import { BrowserRouter, Route, NavLink } from "react-router-dom"

import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Project } from "../../interfaces"

const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const [ projects, setProjects ] = useState<Project[]>([])
  const [ error, setError ] = useState<string>("")
  const [ title, setTitle ] = useState<string>("")

  // const handleAddProject = () => {
  //   const params = {
  //     title: title
  //   }

  //   client.post("projects", { project: params }).then((res) => {
  //     const newProjects = [res.data, ...projects]
  //     setProjects(newProjects);
  //   })

  //   setTitle("");
  // }

  // const handleProjectTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(e.target.value);

  //   if (title != null) {
  //     setError("");
  //   } else {
  //     setError("入力してください");
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     client.get("projects").then((res) => {
  //       setProjects(res.data);
  //     })
  //   };

  //   fetchData();
  // }, []);
 
  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
    </>
  )
}

export default Home
