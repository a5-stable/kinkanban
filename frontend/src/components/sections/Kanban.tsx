import React, { useContext, useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import Lane from "./Lane"
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { NavbarItems } from "./navbarItems";
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';

import Grid from '@mui/material/Grid';

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
 
  const drawerWidth = 220;

  const KanbanContainer = styled(Container) ({
    display: "flex",
    overflowX: "scroll",
    gap: "50px",
  })

  const gridSpacing = 3;
  return (
    <>
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          { NavbarItems.map((text, index) => (
            <ListItem key={text.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary={text.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
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
      <Button
        color="warning"
        variant="contained"
        onClick = {() => console.log("test")}
      >
        Hello World
      </Button>

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
      <KanbanContainer>
        {sections.map((section: Section) => (
          <Lane section={section}/>
        ))}
      </KanbanContainer>
    </>
  )
}

export default Kanban
