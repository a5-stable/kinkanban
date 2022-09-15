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

const StoryCard: any = ({ id, title, isDragOver, sectionId, dispatch, position }) => {

  const submitItemTitle = (e) => {
    const newTitle = e.target.value; // 他の書き方
    client.patch(`stories/${id}`, { story: { title: newTitle }}).then((res) => {
      console.log(res);
    })
  }

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

  return(
    <>
      <Card
        variant="outlined"
        key={id}
        draggable={true}
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ id, title, sectionId, isDragOver })
          );
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          dispatch({
            type: "UPDATE_DRAG_OVER",
            sectionId,
            id,
            isDragOver: true
          });
        }}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          updateDragOver(id)
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.stopPropagation();
          console.log(e);
          const item = e.dataTransfer.getData("text/plain");
          const parsedItem = JSON.parse(item);
          const pos = position;
          updateCategory(id, sectionId, parsedItem.category, pos)
          updateDragOver(id)
        }}
      >
        <CardContent>
          <TextField
            id="standard-basic"
            variant="standard"
            defaultValue={title}
            placeholder={title || "No Title"}
            onBlur={submitItemTitle}
          />
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
