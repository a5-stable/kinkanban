import React, { useContext, useState, useEffect } from "react"

import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Project } from "../../interfaces"

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const [ projects, setProjects ] = useState<Project[]>([])

  const handleAddProject = () => {
    client.post("projects", { project: {title: "あああeeeあwあ"} }).then((res) => {
      console.warn(res.data);
      const newProjects = [res.data, ...projects]
      setProjects(newProjects);
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      client.get("projects").then((res) => {
        setProjects(res.data);
      })
    };

    fetchData();
  }, []);
 
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
      <button onClick={handleAddProject}>+ プロジェクト追加</button>
      <ul>
        {projects.map((project: any) => (
          <>
            <li key={project.id}>
              {project.title}
            </li>
          </>
        ))}
      </ul>
    </>
  )
}

export default Home
