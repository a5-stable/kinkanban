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

const Lane: any = ({ sectionId, stories }) => {
  console.log(stories);
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  });

  type Action =
    | { 
        type: "CREATE";
        sectionId: number;
      }
    | {
        type: "UPDATE_CATEGORY";
        id: number;
        newSectionId: number;
        oldSectionId: number;
        position: number;
      }
    | {
        type: "UPDATE_DRAG_OVER";
        id: number;
        sectionId: number;
        isDragOver: boolean;
      }
    | { 
        type: "DELETE";
        id: number;
        sectionId: number;
      }
    | {
        type: "INITIALIZE";
        payload: any;
      }

  type Item = { id: number; title?: string; isDragOver: boolean };
  type State = any;

  const initialState: State = stories

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "CREATE": {
        let id = null;
        const params = {
          section_id: action.sectionId,
        }
    
        client.post(`stories`, { story: params }).then((res) => {
          id = res.data.id;
        });

        const newParams = {
          id: id,
          sectionId: action.sectionId,
        }

        return [newParams, ...state]
      }
      case "UPDATE_CATEGORY": {
        const { position, oldSectionId, newSectionId } = action;
        const item = state[oldSectionId].find(({ id }) => id === action.id);
        if (!item) return state;

        const filtered = state[oldSectionId].filter(({ id }) => id !== action.id);
        const newSectionList =
          newSectionId === oldSectionId ? filtered : [...state[newSectionId]];

        return {
          ...state,
          [oldSectionId]: filtered,
          [newSectionId]: [
            ...newSectionList.slice(0, position),
            item,
            ...newSectionList.slice(position)
          ]
        };
      }
      case "UPDATE_DRAG_OVER": {
        const updated = state[action.sectionId].map((item: Item) => {
          if (item.id === action.id) {
            return { ...item, isDragOver: action.isDragOver };
          }
          return item;
        });
        return {
          ...state,
          [action.sectionId]: updated
        };
      }
      case "DELETE": {
        client.delete(`stories/${action.id}`).then(() => {
        });

        const filtered = state.filter(
          (item: any) => item.id !== action.id
        );

        return filtered;
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
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

  const Items = (items: Item[], sectionId: number) => {
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
      position: state[newSectionId].length
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
              {Items(state, sectionId)}
            </Typography>
          </CardContent>
        </SectionCard>
      </Grid>
    </>
  )
}
export default Lane
