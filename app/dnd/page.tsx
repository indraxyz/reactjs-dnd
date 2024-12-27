"use client";

import React, {
  useState,
  DragEvent as DragEventReact,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "motion/react";
import { TODO } from "../../lib/mock-data";

const Board = () => {
  const [todos, setTodos] = useState(TODO);

  return (
    <div className="p-4">
      {/* FORM ADD, TRASH */}
      <div>
        <span>form add</span>
        <span>trash</span>
      </div>
      <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-4">
        {/* TODO */}
        <Column type="todo" datas={todos} setDatas={setTodos} />
        {/* PROGRESS */}
        <Column type="progress" datas={todos} setDatas={setTodos} />
        {/* COMPLETED */}
        <Column type="completed" datas={todos} setDatas={setTodos} />
        {/* TRASH */}
      </div>
    </div>
  );
};
export default Board;

type DragStartType = MouseEvent | TouchEvent | PointerEvent | DragEventReact;
type TodoProps = {
  id: number;
  message: string;
  type: string;
};
type ColumnProps = {
  type: string;
  datas: TodoProps[];
  setDatas: Dispatch<SetStateAction<TodoProps[]>>;
};

const Column = ({ type, datas, setDatas }: ColumnProps) => {
  const [hoverEmpty, setHoverEmpty] = useState(false);

  const dragStart = (e: DragStartType, data: TodoProps) => {
    if ("dataTransfer" in e) {
      e.dataTransfer.setData("current", JSON.stringify({ ...data }));
    }
  };

  const dragOver = (e: DragEventReact) => {
    e.preventDefault();
  };

  const dragEnd = (e: DragEventReact, idDrop?: number) => {
    // CEK BEDA TYPE
    const dropItem = datas.find((i) => i.id === idDrop);
    const idxDrop = datas.findIndex((el) => el.id === idDrop);
    let currentContent = JSON.parse(e.dataTransfer.getData("current"));
    const idxCurrent = datas.findIndex((el) => el.id === currentContent.id);
    const copyDatas = [...datas];

    if (dropItem?.type != currentContent.type) {
      // cross type
      currentContent = { ...currentContent, type: dropItem?.type };
      console.log(currentContent);
      console.log(idxCurrent);

      // delete old
      copyDatas.splice(idxCurrent, 1);
      // add/moved new
      copyDatas.splice(idxDrop, 0, currentContent);
      // console.log(copyDatas);
    } else {
      // same type
      copyDatas.splice(idxDrop, 0, copyDatas.splice(idxCurrent, 1)[0]);
    }

    setDatas([...copyDatas]);
  };

  const onEmpty = (e: DragEventReact) => {
    let currentContent = JSON.parse(e.dataTransfer.getData("current"));
    const idxCurrent = datas.findIndex((el) => el.id === currentContent.id);
    const copyDatas = [...datas];
    // delete old
    copyDatas.splice(idxCurrent, 1);
    // push new
    currentContent = { ...currentContent, type };
    copyDatas.push(currentContent);

    setHoverEmpty(false);
    setDatas([...copyDatas]);
  };

  return (
    <div className="w-full sm:1/3 ">
      <div className="flex items-center justify-between px-2">
        <span>Title</span>
        <span>9</span>
      </div>

      {datas.filter((item) => item.type == type).length == 0 ? (
        <div
          className={`${
            hoverEmpty && "bg-slate-200"
          } min-h-20 cursor-grab active:cursor-grabbing select-none border-2 p-2 m-2 rounded-xl`}
          onDrop={(e) => onEmpty(e)}
          onDragOver={dragOver}
          onDragEnter={() => setHoverEmpty(true)}
          onDragLeave={() => setHoverEmpty(false)}
        >
          <span>empty</span>
        </div>
      ) : (
        datas
          .filter((item) => item.type == type)
          .map((d) => (
            <Card
              key={d.id}
              data={d}
              dragStart={dragStart}
              dragOver={dragOver}
              dragEnd={dragEnd}
            />
          ))
      )}
    </div>
  );
};

type CardProps = {
  data: TodoProps;
  dragStart: (e: DragStartType, data: TodoProps) => void;
  dragOver: (e: DragEventReact) => void;
  dragEnd: (e: DragEventReact, idx: number) => void;
};
const Card = ({ data, dragStart, dragOver, dragEnd }: CardProps) => {
  const [hover, setHover] = useState(false);
  return (
    <div>
      <motion.div
        layout
        key={data.id}
        layoutId={`${data.id}`}
        draggable
        onDragStart={(e) => dragStart(e, data)}
        onDragOver={(e) => dragOver(e)}
        onDrop={(e) => {
          setHover(false);
          dragEnd(e, data.id);
        }}
        onDragEnter={() => setHover(true)}
        onDragLeave={() => setHover(false)}
        className={`${
          hover && "bg-slate-200"
        } cursor-grab active:cursor-grabbing border-2 p-2 m-2 rounded-xl min-h-20`}
      >
        {data.message}
      </motion.div>
    </div>
  );
};

// https://www.freecodecamp.org/news/reactjs-implement-drag-and-drop-feature-without-using-external-libraries-ad8994429f1a/
// https://dev.to/wolfmath/drag-and-drop-with-react-519m
// https://www.codinn.dev/projects/react-drag-and-drop-without-library

// 4 categories TASK = TODO, PROGRESS, COMPLETED
// COLUMN RESPONSIVE
// COMPONENTS= CONTAINER, , , ,
// COLUMN
//   CARD
//   FORM
//   TRASH
// drag & drop between column-type
// https://salehmubashar.com/blog/5-cool-animations-in-react-with-framer-motion
