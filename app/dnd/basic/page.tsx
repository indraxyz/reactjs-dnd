"use client";

import React, { useState, DragEvent as DragEventReact } from "react";
import { motion } from "motion/react";
import { TODO } from "../../../lib/mock-data";

const Board = () => {
  return (
    <div className="flex">
      {/* TODO + FORM ADD */}
      <Column type="todo" />
      {/* PROGRESS */}
      <Column type="progress" />
      {/* COMPLETED */}
      {/* TRASH */}
    </div>
  );
};
export default Board;

type ColumnProps = {
  type: string;
};
const Column = ({ type }: ColumnProps) => {
  const [datas, setDatas] = useState(TODO);

  const dragStart = (
    e: MouseEvent | TouchEvent | PointerEvent | DragEventReact,
    data: {
      id: number;
      message: string;
    }
  ) => {
    // const idx = datas.findIndex((el) => el.id === data.id);

    if ("dataTransfer" in e) {
      e.dataTransfer.setData("current", JSON.stringify({ ...data }));
    }
  };

  const dragOver = (e: DragEventReact) => {
    e.preventDefault();
  };

  const dragEnd = (e: DragEventReact, idDrop: number) => {
    // CEK BEDA TYPE
    const dropItem = datas.find((i) => i.id === idDrop);
    const idxDrop = datas.findIndex((el) => el.id === idDrop);
    let currentContent = JSON.parse(e.dataTransfer.getData("current"));
    const idxCurrent = datas.findIndex((el) => el.id === currentContent.id);
    const copyDatas = [...datas];

    if (dropItem?.type != currentContent.type) {
      console.log("cross");
      // cross type
      currentContent = { ...currentContent, type: dropItem?.type };
      console.log(currentContent);
      console.log(idxCurrent);

      // copyDatas.splice(idxDrop, 0, copyDatas.splice(idxCurrent, 1)[0]);
      // delete old
      copyDatas.splice(idxCurrent, 1);
      console.log(copyDatas);
      setDatas([...copyDatas]);
    } else {
      // same type
      copyDatas.splice(idxDrop, 0, copyDatas.splice(idxCurrent, 1)[0]);
      setDatas([...copyDatas]);
    }

    // console.log(dropItem);
    // console.log(currentContent);

    // filter, find

    // copyDatas = copyDatas.filter((c) => c.id !== currentContent.id);
    // setDatas([...copyDatas]);
  };

  return (
    <div className="w-1/3">
      {datas
        .filter((item) => item.type == type)
        .map((d) => (
          <Card
            key={d.id}
            data={d}
            dragStart={dragStart}
            dragOver={dragOver}
            dragEnd={dragEnd}
          />
        ))}
    </div>
  );
};

type CardProps = {
  data: {
    id: number;
    message: string;
  };
  dragStart: (
    e: MouseEvent | TouchEvent | PointerEvent | DragEventReact,
    data: {
      id: number;
      message: string;
    }
  ) => void;
  dragOver: (e: DragEventReact) => void;
  dragEnd: (e: DragEventReact, idx: number) => void;
};
const Card = ({ data, dragStart, dragOver, dragEnd }: CardProps) => {
  return (
    <div>
      <motion.div
        layout
        transition={{ type: "spring" }}
        key={data.id}
        layoutId={`${data.id}`}
        draggable
        onDragStart={(e) => dragStart(e, data)}
        onDragOver={(e) => dragOver(e)}
        onDrop={(e) => dragEnd(e, data.id)}
        className="h-20"
      >
        {data.message}
      </motion.div>
    </div>
  );
};

// https://www.freecodecamp.org/news/reactjs-implement-drag-and-drop-feature-without-using-external-libraries-ad8994429f1a/
// https://dev.to/wolfmath/drag-and-drop-with-react-519m
// https://www.codinn.dev/projects/react-drag-and-drop-without-library

// 4 categories TASK = TODO, PROGRESS, COMPLETED, TRASH
// COLUMN RESPONSIVE
// COMPONENTS= CONTAINER, , , ,
// COLUMN
//   CARD
//   FORM
//   TRASH
// drag & drop between column/category
// recovery from TRASH
// https://salehmubashar.com/blog/5-cool-animations-in-react-with-framer-motion
