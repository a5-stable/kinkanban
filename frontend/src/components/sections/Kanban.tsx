import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import Lane from "./Lane"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const Kanban: React.FC = () => {
  const { id } = useParams();
  const [ sections, setSections ] = useState<Section[]>([])
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
  }

  useEffect(() => {
    const fetchData = async () => {
      client.get("sections").then((res) => {
        setSections(res.data);
      })
    };

    fetchData();
  }, []);

  useEffect(() => {
  }, [sections]);
 
  const KanbanContainer = styled(Container) ({
    display: "flex",
    overflowX: "scroll",
    gap: "50px",
    height: "100%",
  })

  return (
    <>
      <KanbanContainer>
        {sections.map((section: Section) => (
          <Lane section={section}/>
        ))}
        <div style={{width: "300px"}}>
          <Button 
            variant="text"
            onClick={handleAddSection}
          >
            + Add Section
          </Button>
        </div>
      </KanbanContainer>
    </>
  )
}

export default Kanban
