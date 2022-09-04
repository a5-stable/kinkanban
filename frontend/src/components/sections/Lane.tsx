import React, { useContext, useState, useEffect, useReducer, ChangeEvent } from "react"
import client from "../../lib/api/client"
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Section, Story } from "../../interfaces";

import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';

const Lane: any = ({ section }: { section: Section }) => {
  const SectionCard = styled(Card) ({
    height: "100%",
    width: "300px",
  });

  const handleAddStory = (section_id: Number) => {
    const params = {
      section_id: section_id,
    }

    client.post(`stories`, { story: params }).then((res) => {
      console.log(res);
    });
  }

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
      };

  type Item = { id: number; title?: string; isDragOver: boolean };
  type State = { [key in any]: any };

  const initialState: State = {
    1: [{ id: 1, title: "Task 4", isDragOver: false }],
    2: [{ id: 2, title: "Task 3", isDragOver: false }],
    3: [
      { id: 3, title: "Task 2", isDragOver: false },
      { id: 4, title: "Task 1", isDragOver: false },
    ],
  };

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

        return {
          ...state,
          [action.sectionId]: [
            { id: id, isDragOver: false },
            ...state[action.sectionId]
          ]
        };
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
        const filtered = state[action.sectionId].filter(
          (item: any) => item.id !== action.id
        );
        return {
          ...state,
          [action.sectionId]: filtered
        };
      }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const [add, setAdd] = useState(false);
  const [addInput, setAddInput] = useState("");

  const Items = (items: Item[], sectionId: number) => {
    const itemsa = typeof items === "undefined" ? [] : items
    return itemsa.map(({ id, title, isDragOver }) => (
      <div
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
          dispatch({
            type: "UPDATE_DRAG_OVER",
            sectionId,
            id,
            isDragOver: false
          });
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.stopPropagation();
          const item = e.dataTransfer.getData("text/plain");
          const parsedItem = JSON.parse(item);
          const position = state[sectionId].findIndex((i: number) => i.id === id);
          dispatch({
            type: "UPDATE_CATEGORY",
            id: parsedItem.id,
            newSectionId: sectionId,
            oldSectionId: parsedItem.category,
            position
          });
          dispatch({
            type: "UPDATE_DRAG_OVER",
            sectionId,
            id,
            isDragOver: false,
          });
        }}
      >
        <div className={"itemContent" + (isDragOver ? " dashed" : "")}>
          <h2>{title}</h2>
          <button onClick={() => dispatch({ type: "DELETE", sectionId, id })}>
            削除する
          </button>
        </div>
      </div>
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
      <Grid item>
        <SectionCard>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <Input
                defaultValue={section.title ? section.title : "No title"}
              />
            </Typography>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              <Button
                onClick={() => dispatch({ type: "CREATE", sectionId: section.id })}
                color="secondary"
              >
                + Add Story
              </Button>
              <div
               className="items"
               onDragOver={(e) => e.preventDefault()}
               onDrop={(e) => onItemsDrop(e, section.id)}
              >
                {Items(state[section.id], section.id)}
              </div>
            </Typography>
          </CardContent>
        </SectionCard>
      </Grid>
    </>
  )
    // return (
    //   <div className="container">
    //     <section className="content">
    //       <div>
    //         <div className="todo">
    //           <h1>Todo</h1>
    //           <button onClick={() => setAdd(true)}>
    //             追加
    //           </button>
    //         </div>
    //         {add && (
    //           <div className="addItem">
    //             <input
    //               type="text"
    //               onKeyUp={(e) => {
    //                 if (e.code === "Enter") {
    //                   e.preventDefault();
    //                   e.stopPropagation();
    //                   dispatch({ type: "CREATE", content: addInput });
    //                   setAddInput("");
    //                   setAdd(false);
    //                 }
    //               }}
    //               onChange={onAddInputChange}
    //               value={addInput}
    //             />
    //             <div>
    //               <button
    //                 onClick={() => {
    //                   dispatch({ type: "CREATE", content: addInput });
    //                   setAddInput("");
    //                   setAdd(false);
    //                 }}
    //               >
    //                 Add
    //               </button>
    //               <button onClick={() => setAdd(false)}>Cancel</button>
    //             </div>
    //           </div>
    //         )}
    //         <div
    //           className="items"
    //           onDragOver={(e) => e.preventDefault()}
    //           onDrop={(e) => onItemsDrop(e, "todo")}
    //         >
    //           {Items(state.todo, "todo")}
    //         </div>
    //       </div>
    //       <div>
    //         <h1>Doing</h1>
    //         <div
    //           className="items"
    //           onDragOver={(e) => e.preventDefault()}
    //           onDrop={(e) => onItemsDrop(e, "doing")}
    //         >
    //           {Items(state.doing, "doing")}
    //         </div>
    //       </div>
    //       <div>
    //         <h1>Done</h1>
    //         <div
    //           className="items"
    //           onDragOver={(e) => e.preventDefault()}
    //           onDrop={(e) => onItemsDrop(e, "done")}
    //         >
    //           {Items(state.done, "done")}
    //         </div>
    //       </div>
    //     </section>
    //   </div>
    // );
};
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import { Section, Story } from "../../interfaces";

// import Grid from '@mui/material/Grid';
// import Input from '@mui/material/Input';

// type State = {};
// type storyAction =
//   | { type: "CREATE"; content: string }
//   | {
//       type: "UPDATE_CATEGORY";
//       id: number;
//       position: number;
//       newSectionId: number;
//     };

// const [state, dispatch] = useReducer(reducer, initialState);
// const [add, setAdd] = useState(false);
// const [addInput, setAddInput] = useState("");

// const reducer = (state: any, action: any) => {
//   switch(action) {
//     case "CREATE": {
//       return {
//         ...state,
//         todo: [
//           { id: Date.now(), content: action.content, isDragOver: false },
//           ...state.todo
//         ]
//       };
//     }
//   }
// };

// const Lane: any = ({ section }: { section: Section }) => {
//   const SectionCard = styled(Card) ({
//     height: "100%",
//     width: "300px",
//   })

//   const submitTitleUpdate = (id: Number) => {
//     const params = {
//       title: "test",
//     }

//     client.patch(`sections/${id}`, { section: params }).then((res) => {
//     })
//   }

//   const handleAddStory = (section_id: Number) => {
//     const params = {
//       section_id: section_id,
//     }

//     client.post(`stories`, { story: params }).then((res) => {
//       console.log(res);
//     });
//   }
  
//   return(
//     <>
//       <Grid item>
//         <SectionCard>
//           <CardContent>
//             <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//               <Input
//                 defaultValue={section.title ? section.title : "No title"}
//               />
//             </Typography>
//             <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
//               <Button
//                 onClick={() => handleAddStory(section.id)}
//                 color="secondary"
//               >
//                 + Add Story
//               </Button>
//             </Typography>
//           </CardContent>
//         </SectionCard>
//       </Grid>
//     </>
//   )
// }

export default Lane
