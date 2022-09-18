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
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@material-ui/core";
import { SortableItem } from "./SortableItem";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";

const StoryCard: any = ({ id, title, isDragOver, sectionId, dispatch, position }) => {

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({ id: id })

  const submitItemTitle = (e) => {
    const newTitle = e.target.value; // 他の書き方
    client.patch(`stories/${id}`, { story: { title: newTitle }}).then((res) => {
      console.log(res);
    })
  }

  const deleteItem = (sectionId, id) => {
    dispatch({ type: "DELETE", sectionId, id })
  }

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    paddingLeft: 5,
    borderRadius: 5,
    marginBottom: 5,
    userSelect: "none",
    cursor: "grab",
    boxSizing: "border-box"
  };

  return(
    <>
      <Card
        style={itemStyle}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        variant="outlined"
      >
        <CardContent>
          <Typography variant="h5" component="div">
            <TextField
              id="standard-basic"
              variant="standard"
              defaultValue={title}
              placeholder={title || "No Title"}
              onBlur={submitItemTitle}
            />
          </Typography>
          <IconButton
            aria-label="delete"
            onClick={() => deleteItem(sectionId, id)}
          >
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </>
  )
};

export default StoryCard
