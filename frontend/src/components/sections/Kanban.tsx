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
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

const Kanban: React.FC = () => {
  const { id } = useParams();
  const [ sections, setSections ] = useState<Section[]>([])
  const [ title, setTitle ] = useState<string>("")
  const [ data, dispatch ] = useReducer(reducer, {});


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
        type: "UPDATE_SECTION";
        activeContainerId: number,
        activeIndex: number,
        overContainerId: number,
        overIndex: number,
        id: number
      }
    | {
      type: "REORDER";
      sectionId: number;
      activeIndex: number;
      overIndex: number;
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

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainerId = active.data.current.sortable.containerId;
      const overContainerId = over.data.current.sortable.containerId;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current.sortable.index;

      if (activeContainerId === overContainerId) {
        dispatch({
          type: "REORDER",
          sectionId: activeContainerId,
          activeIndex: activeIndex,
          overIndex: overIndex
        })
      } else {
        dispatch({
          type: "UPDATE_SECTION",
          activeContainerId: activeContainerId,
          activeIndex: activeIndex,
          overContainerId: overContainerId,
          overIndex: overIndex,
          id: active.id
        })
      }
    }
  };

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "CREATE": {
        let id = null;
        const params = {
          section_id: action.sectionId,
        }
    
        client.post(`stories`, { story: params }).then((res) => {
          id = res.data.id; //意味ない
        });

        const newParams = {
          id: id,
          sectionId: action.sectionId,
        }

        return {...state, [action.sectionId]: [ ...state[action.sectionId], newParams ]}
      }
      case "UPDATE_SECTION": {
        const { activeContainerId, activeIndex, overContainerId, overIndex, id } = action
        const active = state[activeContainerId].filter((item) =>  item.id === id )
        return  {
          ...state,
          [activeContainerId]: [...state[activeContainerId].slice(0, activeIndex), ...state[activeContainerId].slice(activeIndex + 1)],
          [overContainerId]: [...state[overContainerId].slice(0, overIndex + 1), active[0], ...state[overContainerId].slice(overIndex + 1)]
        };
      }
      case "REORDER": {
        const { sectionId, activeIndex, overIndex } = action;
        return {
          ...state,
          [sectionId]: arrayMove(
            state[sectionId],
            activeIndex,
            overIndex
          )
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
    <div
      style={{
        margin: 'auto',
        width: 200,
        textAlign: 'center'
      }}
    >
    </div>
      <KanbanContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {Object.keys(data).map((key) => (
            <Lane
              key={key}
              sectionId={key}
              stories={data[key]}
              dispatch={dispatch}
            />
          ))}
        </DndContext>
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
