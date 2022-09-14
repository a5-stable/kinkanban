import React, { useContext, useState, useEffect, useReducer, ChangeEvent } from "react"
import client from "../../lib/api/client"
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Section, Story } from "../../interfaces";
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import StoryCard from "./StoryCard";

const Lane: any = ({ sectionId, stories, dispatch }) => {
  console.log(stories);
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  });

  const [add, setAdd] = useState(false);
  const [addInput, setAddInput] = useState("");

  useEffect(() => {
    console.log(stories);
  }, [])

  const updateDragOver = (id) => {
    dispatch({
      type: "UPDATE_DRAG_OVER",
      sectionId,
      id,
      isDragOver: true
    });
  }

  const updateCategory = (id, newSectionId, oldSectionId, position) => {
    dispatch({
      type: "UPDATE_CATEGORY",
      id: id,
      newSectionId: newSectionId,
      oldSectionId: oldSectionId,
      position
    });
  }

  const deleteItem = (sectionId, id) => {
    dispatch({ type: "DELETE", sectionId, id })
  }

  const Items = (items: any, sectionId: number) => {
    const itemsa = typeof items === "undefined" ? [] : items
    return itemsa.map(({ id, title, isDragOver }, index) => (
      <StoryCard
        id={id}
        title={title}
        isDragOver={isDragOver}
        sectionId={sectionId}
        updateDragOver={updateDragOver}
        updateCategory={updateCategory}
        deleteItem={deleteItem}
        position={index}
      >
      </StoryCard>
    ));
  };

  const onAddInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setAddInput(value);
  };


  const onItemsDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newSectionId: number
  ) => {
    const item = e.dataTransfer.getData("text/plain");
    const parsedItem = JSON.parse(item);
    dispatch({
      type: "UPDATE_CATEGORY",
      id: parsedItem.id,
      newSectionId,
      oldSectionId: parsedItem.sectionId,
      position: 2
    });
  };

  return(
    <>
      <Grid
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onItemsDrop(e, sectionId)}
      >
        <SectionCard>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <Input
                defaultValue="No title"
              />
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <Button
                onClick={() => dispatch({ type: "CREATE", sectionId: sectionId})}
                color="secondary"
              >
                + Add Story
              </Button>
              {Items(stories, sectionId)}
            </Typography>
          </CardContent>
        </SectionCard>
      </Grid>
    </>
  )
}
export default Lane
