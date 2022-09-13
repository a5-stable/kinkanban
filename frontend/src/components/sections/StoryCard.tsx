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

const StoryCard: any = ({ id, title, isDragOver, sectionId, updateDragOver, updateCategory, deleteItem, position }) => {

  const submitItemTitle = (e) => {
    const newTitle = e.target.value; // 他の書き方
    client.patch(`stories/${id}`, { story: { title: newTitle }}).then((res) => {
      console.log(res);
    })
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
          updateDragOver(id)
        }}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          updateDragOver(id)
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.stopPropagation();
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
          <button onClick={() => deleteItem}>
            削除する
          </button>
        </CardContent>
      </Card>
    </>
  )
};

export default StoryCard