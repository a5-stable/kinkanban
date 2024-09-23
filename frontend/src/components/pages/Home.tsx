import React, { useContext, useState, useEffect } from "react"
import { BrowserRouter, Route, NavLink, Routes } from "react-router-dom"

import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Project } from "../../interfaces"
import ListPage from "./ListPage"

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
    <Routes>
      <Route path="/" element={<ListPage />} />
    </Routes>
  )
}

export default Home
