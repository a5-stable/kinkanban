import React, { useContext, useState, useEffect, useReducer } from "react"
import { useParams } from 'react-router-dom';
import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"
import { Section } from "../../interfaces"
import Lane from "./Lane"
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Counter from './Counter'
import Kanb from "./Lane";

const Kanban: React.FC = () => {
  const { id } = useParams();
  const [ sections, setSections ] = useState<Section[]>([])
  const [ title, setTitle ] = useState<string>("")
  const [ data, dispatch] = useReducer(reducer, {});


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
    client.get(`projects/${id}/search`).then((res) => {
      dispatch({ type: "INITIALIZE", payload: res.data.body})
    });
  }, []);

  useEffect(() => {
  }, [sections]);
 
  const KanbanContainer = styled(Container) ({
    display: "flex",
    overflowX: "scroll",
    gap: "50px",
    height: "100%",
  })

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

        return {...state, [action.sectionId]: [ ...state[action.sectionId], newParams ]}
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
        console.log(action);
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

        const filtered = state[action.sectionId].filter(
          (item: any) => item.id !== action.id
        );

        return { ...state, [action.sectionId]: filtered };
      }
      case "INITIALIZE": {
        return action.payload;
      }
    }
  }

  return (
    <>
      <KanbanContainer>
        {Object.keys(data).map((key) => (
          <Lane
            sectionId={key}
            stories={data[key]}
            dispatch={dispatch}
          />
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
