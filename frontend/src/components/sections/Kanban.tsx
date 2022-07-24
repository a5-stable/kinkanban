import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import Lane from "./Lane"

const Kanban: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)
  const { id } = useParams();
  const [ sections, setSections ] = useState<Section[]>([])
  const [ error, setError ] = useState<string>("")
  const [ title, setTitle ] = useState<string>("")

  const handleAddSection = () => {
    const params = {
      title: title,
      project_id: id
    }

    client.post("sections", { section: params }).then((res) => {
      const newSections = [res.data, ...sections]
      setSections(newSections);
    })

    setTitle("");
  }

  const handleSectionTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const new_title = e.target.value
    setTitle(new_title);

    if (new_title) {
      setError("");
    } else {
      setError("入力してください");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      client.get("sections").then((res) => {
        setSections(res.data);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddSection();
        }}
      >
        <input
          type="text"
          onChange={(e) => handleSectionTitleChange(e)}
        />
        <input
          type="submit"
          value="追加"
        />
        <small>
          {error}
        </small>
      </form>
      {sections.map((section: Section) => (
        <>
          <div style={{display: "flex"}}>
            <Lane
              section={section}
            >
            </Lane>
          </div>
        </>
      ))}
    </>
  )
}

export default Kanban
