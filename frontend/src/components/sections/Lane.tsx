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
import Spacer from "./Spacer";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";

const Lane: any = ({ sectionId, stories, dispatch }) => {
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  });

  const [add, setAdd] = useState(false);
  const [addInput, setAddInput] = useState("");

  useEffect(() => {
  }, [])

  const Items = (items: any, sectionId: number) => {
    const itemsa = typeof items === "undefined" ? [] : items
    return itemsa.map(({ id, title, isDragOver }, index) => (
      <>
        <Spacer y={2} />
        <StoryCard
          id={id}
          title={title}
          isDragOver={isDragOver}
          sectionId={sectionId}
          dispatch={dispatch}
          position={index}
        >
        </StoryCard>
      </>
    ));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { setNodeRef } = useDroppable({ sectionId });
  return(
    <>
      <SortableContext
        id={sectionId}
        items={stories}
        strategy={verticalListSortingStrategy}
      >
        <Grid
         style={{border: '1px solid'}}
        >
          {stories.map(({ id, title, isDragOver }, index) => (
          <>
            <Spacer y={2} />
            <StoryCard
              id={id}
              key={id}
              title={title}
              isDragOver={isDragOver}
              sectionId={sectionId}
              dispatch={dispatch}
              position={index}
            >
            </StoryCard>
         </>
          ))}
        </Grid>
      </SortableContext>
    </>
  )
}
export default Lane
