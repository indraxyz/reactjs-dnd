"use client";

import React, { useState, DragEvent as DragEventReact } from "react";

const Page = () => {
  const [datas, setDatas] = useState([
    {
      id: 1,
      fullname: "john",
      age: 29,
    },
    {
      id: 2,
      fullname: "Rey",
      age: 39,
    },
    {
      id: 5,
      fullname: "Roi",
      age: 49,
    },
    {
      id: 3,
      fullname: "Dui",
      age: 59,
    },
    {
      id: 4,
      fullname: "IUD",
      age: 69,
    },
  ]);

  const dragStart = (
    e: MouseEvent | TouchEvent | PointerEvent | DragEventReact,
    idx: number,
    data: object
  ) => {
    if ("dataTransfer" in e) {
      e.dataTransfer.setData("current", JSON.stringify({ ...data, idx }));
    }
  };

  const dragOver = (e: DragEventReact) => {
    e.preventDefault();
  };

  const dragEnd = (e: DragEventReact, idxDrop: number) => {
    const currentContent = JSON.parse(e.dataTransfer.getData("current"));
    console.log(currentContent);
    const copyDatas = [...datas];
    // filter, find
    // copyDatas.splice(currentContent.idx, 1); //delete moved content
    // copyDatas.splice(idxDrop, 0, currentContent); // insertAtIndex
    copyDatas.splice(idxDrop, 0, copyDatas.splice(currentContent.idx, 1)[0]);
    setDatas([...copyDatas]);
  };

  return (
    <>
      {datas.map((d, i) => (
        <Card
          key={i}
          idx={i}
          data={d}
          dragStart={dragStart}
          dragOver={dragOver}
          dragEnd={dragEnd}
        />
      ))}
    </>
  );
};

export default Page;

type CardProps = {
  data: {
    id: number;
    fullname: string;
    age: number;
  };
  idx: number;
  dragStart: (
    e: MouseEvent | TouchEvent | PointerEvent | DragEventReact,
    idx: number,
    data: object
  ) => void;
  dragOver: (e: DragEventReact) => void;
  dragEnd: (e: DragEventReact, idx: number) => void;
};
const Card = ({ data, idx, dragStart, dragOver, dragEnd }: CardProps) => {
  return (
    <div
      // layoutId={`${data.id}`}
      draggable
      onDragStart={(e) => dragStart(e, idx, data)}
      onDragOver={(e) => dragOver(e)}
      onDrop={(e) => dragEnd(e, idx)}
      className="h-20"
    >
      {data.fullname} {data.age}
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
