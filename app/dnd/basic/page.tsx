"use client";

import React, { useState, DragEvent } from "react";
import { motion } from "motion/react";

const Page = () => {
  const [data, setData] = useState([
    {
      fullname: "john",
      age: 29,
    },
    {
      fullname: "Rey",
      age: 39,
    },
    {
      fullname: "Roi",
      age: 39,
    },
    {
      fullname: "Dui",
      age: 39,
    },
    {
      fullname: "Elea",
      age: 39,
    },
  ]);

  const dragStart = (
    e: MouseEvent | TouchEvent | PointerEvent | DragEvent,
    idx: number
  ) => {
    if ("dataTransfer" in e) {
      e.dataTransfer.setData("position", idx.toString());
    }

    // console.log("start at " + idx);
  };

  // const dragEnter = (e: DragEvent, idx: number) => {
  //   e.dataTransfer.setData("hover", idx);
  //   console.log("hover at " + idx);
  // };

  const dragOver = (e: DragEvent) => {
    // e.dataTransfer.setData("hover", idx.toString());
    e.preventDefault();
    // console.log("drag over");
  };

  const dragEnd = (e: DragEvent, drop: number) => {
    // const idx = e.dataTransfer.getData("position");
    // const currentContent = copyData[idx];
    // let tasks = data.filter((task) => {
    //   if (task.fullname == idx) {
    //   }
    //   return;
    // });
    // copyData.splice(idx, 1); //delete moved content
    // copyData.splice(drop, 0, currentContent);
    // setData([...copyData]);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody className="transition-all">
          {data.map((d, i) => (
            <tr
              key={i}
              className="h-10 transition-transform"
              draggable
              onDragStart={(e) => dragStart(e, d.fullname)}
              onDragOver={(e) => dragOver(e)}
              onDrop={(e) => dragEnd(e, i)}
            >
              <td>{d.fullname}</td>
              <td>{d.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Page;

// https://www.freecodecamp.org/news/reactjs-implement-drag-and-drop-feature-without-using-external-libraries-ad8994429f1a/
// https://dev.to/wolfmath/drag-and-drop-with-react-519m
// https://www.codinn.dev/projects/react-drag-and-drop-without-library
