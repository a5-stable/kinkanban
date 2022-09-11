import * as JD from "https://cdn.skypack.dev/decoders@2.0.1";
const { ChangeEvent, SVGAttributes, useReducer, useState } = React;

type Action =
  | { type: "CREATE"; content: string }
  | {
      type: "UPDATE_CATEGORY";
      newCategory: Category;
      oldCategory: Category;
      position: number;
      id: number;
    }
  | {
      type: "UPDATE_DRAG_OVER";
      id: number;
      category: Category;
      isDragOver: boolean;
    }
  | { type: "DELETE"; id: number; category: Category };

type Category = "todo" | "doing" | "done";
type Item = { id: number; content: string; isDragOver: boolean };
type State = { [key in Category]: Item[] };

const initialState: State = {
  todo: [{ id: Date.now(), content: "Task 4", isDragOver: false }],
  doing: [{ id: Date.now() + 1, content: "Task 3", isDragOver: false }],
  done: [
    { id: Date.now() + 2, content: "Task 2", isDragOver: false },
    { id: Date.now() + 3, content: "Task 1", isDragOver: false }
  ]
};
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "CREATE": {
      if (action.content.trim().length === 0) return state;
      return {
        ...state,
        todo: [
          { id: Date.now(), content: action.content, isDragOver: false },
          ...state.todo
        ]
      };
    }
    case "UPDATE_CATEGORY": {
      const { position, newCategory, oldCategory } = action;
      const item = state[oldCategory].find(({ id }) => id === action.id);
      if (!item) return state;

      const filtered = state[oldCategory].filter(({ id }) => id !== action.id);
      const newCategoryList =
        newCategory === oldCategory ? filtered : [...state[newCategory]];

      return {
        ...state,
        [oldCategory]: filtered,
        [newCategory]: [
          ...newCategoryList.slice(0, position),
          item,
          ...newCategoryList.slice(position)
        ]
      };
    }
    case "UPDATE_DRAG_OVER": {
      const updated = state[action.category].map((item) => {
        if (item.id === action.id) {
          return { ...item, isDragOver: action.isDragOver };
        }
        return item;
      });
      return {
        ...state,
        [action.category]: updated
      };
    }
    case "DELETE": {
      const filtered = state[action.category].filter(
        (item) => item.id !== action.id
      );
      return {
        ...state,
        [action.category]: filtered
      };
    }
  }
}

const ItemDecoder = JD.object({
  id: JD.number,
  content: JD.string,
  isDragOver: JD.boolean,
  category: JD.oneOf(["todo", "doing", "done"])
});

const AddIcon = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth={2}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const DeleteIcon = (props: SVGAttributes<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19 7-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
    />
  </svg>
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [add, setAdd] = useState(false);
  const [addInput, setAddInput] = useState("");

  const Items = (items: Item[], category: Category) => {
    return items.map(({ id, content, isDragOver }) => (
      <div
        key={id}
        draggable={true}
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ id, content, category, isDragOver })
          );
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          dispatch({
            type: "UPDATE_DRAG_OVER",
            category,
            id,
            isDragOver: true
          });
        }}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          dispatch({
            type: "UPDATE_DRAG_OVER",
            category,
            id,
            isDragOver: false
          });
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.stopPropagation();
          const item = e.dataTransfer.getData("text/plain");
          const parsedItem = JSON.parse(item);
          const decodedItem = ItemDecoder.verify(parsedItem);
          const position = state[category].findIndex((i) => i.id === id);
          dispatch({
            type: "UPDATE_CATEGORY",
            id: decodedItem.id,
            newCategory: category,
            oldCategory: decodedItem.category,
            position
          });
          dispatch({
            type: "UPDATE_DRAG_OVER",
            category,
            id,
            isDragOver: false
          });
        }}
      >
        <div className={"itemContent" + (isDragOver ? " dashed" : "")}>
          <h2>{content}</h2>
          <button onClick={() => dispatch({ type: "DELETE", category, id })}>
            <DeleteIcon height={13} width={13} />
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
    newCategory: Category
  ) => {
    const item = e.dataTransfer.getData("text/plain");
    const parsedItem = JSON.parse(item);
    const decodedItem = ItemDecoder.verify(parsedItem);
    dispatch({
      type: "UPDATE_CATEGORY",
      id: decodedItem.id,
      newCategory,
      oldCategory: decodedItem.category,
      position: state[newCategory].length
    });
  };

  return (
    <div className="container">
      <section className="content">
        <div>
          <div className="todo">
            <h1>Todo</h1>
            <button onClick={() => setAdd(true)}>
              <AddIcon height={15} width={15} />
            </button>
          </div>
          {add && (
            <div className="addItem">
              <input
                type="text"
                onKeyUp={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch({ type: "CREATE", content: addInput });
                    setAddInput("");
                    setAdd(false);
                  }
                }}
                onChange={onAddInputChange}
                value={addInput}
              />
              <div>
                <button
                  onClick={() => {
                    dispatch({ type: "CREATE", content: addInput });
                    setAddInput("");
                    setAdd(false);
                  }}
                >
                  Add
                </button>
                <button onClick={() => setAdd(false)}>Cancel</button>
              </div>
            </div>
          )}
          <div
            className="items"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onItemsDrop(e, "todo")}
          >
            {Items(state.todo, "todo")}
          </div>
        </div>
        <div>
          <h1>Doing</h1>
          <div
            className="items"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onItemsDrop(e, "doing")}
          >
            {Items(state.doing, "doing")}
          </div>
        </div>
        <div>
          <h1>Done</h1>
          <div
            className="items"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onItemsDrop(e, "done")}
          >
            {Items(state.done, "done")}
          </div>
        </div>
      </section>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
