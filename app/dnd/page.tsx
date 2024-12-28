"use client";

import {
  useState,
  DragEvent as DragEventReact,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "motion/react";
import { TODO } from "../../lib/mock-data";
import { MdDelete, MdDeleteForever, MdAddBox } from "react-icons/md";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";

const Board = () => {
  const [todos, setTodos] = useState(TODO);
  const [deleteActive, setDeleteActive] = useState(false);
  const [dialogAdd, setDialogAdd] = useState(false);
  const [todo, setTodo] = useState("");

  const submitTodo = () => {
    const newTodo = {
      id: Math.random(),
      message: todo,
      type: "todo",
    };

    setTodos([...todos, newTodo]);
    setDialogAdd(false);
  };

  const onDeleteLeave = () => {
    setDeleteActive(false);
  };

  const onDeleteOver = (e: DragEventReact) => {
    e.preventDefault();
    setDeleteActive(true);
  };

  const onDeleteDrop = (e: DragEventReact) => {
    const currentContent = JSON.parse(e.dataTransfer.getData("current"));
    setTodos((pv) => pv.filter((c) => c.id !== currentContent.id));
    setDeleteActive(false);
  };

  return (
    <div className="p-4">
      {/* FORM ADD, TRASH */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="border-2 border-gray-400 rounded-xl p-4 sm:p-8 active:bg-gray-200"
          onClick={() => setDialogAdd(true)}
        >
          <MdAddBox className="text-3xl" />
        </button>
        <div
          className={`border-2 border-gray-400 rounded-xl p-4 sm:p-8 ${
            deleteActive && "bg-gray-200"
          }`}
          onDragOver={onDeleteOver}
          onDrop={onDeleteDrop}
          onDragLeave={onDeleteLeave}
        >
          {deleteActive ? (
            <MdDeleteForever className="text-3xl animate-bounce" />
          ) : (
            <MdDelete className="text-3xl" />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-8 sm:space-y-0 sm:space-x-4">
        {/* TODO */}
        <Column title="📌 todo" type="todo" datas={todos} setDatas={setTodos} />
        {/* PROGRESS */}
        <Column
          title="🔃 progress"
          type="progress"
          datas={todos}
          setDatas={setTodos}
        />
        {/* COMPLETED */}
        <Column
          title="✅ completed"
          type="completed"
          datas={todos}
          setDatas={setTodos}
        />
      </div>

      {/* MODAL ADD */}
      <Modal isOpen={dialogAdd} onOpenChange={(op) => setDialogAdd(op)}>
        <ModalContent>
          {dialogAdd && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New TODO
              </ModalHeader>
              <ModalBody>
                <Textarea
                  className="max-w-sm"
                  label="TODO"
                  labelPlacement="outside"
                  placeholder="........"
                  onValueChange={(str) => setTodo(str)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setDialogAdd(false)}
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={() => submitTodo()}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
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
  title: string;
  type: string;
  datas: TodoProps[];
  setDatas: Dispatch<SetStateAction<TodoProps[]>>;
};

const Column = ({ title, type, datas, setDatas }: ColumnProps) => {
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

  const filteredDatas = datas.filter((item) => item.type == type);

  return (
    <div className="w-full sm:1/3 ">
      <div className="flex items-center justify-between px-2 underline-offset-4 underline decoration-2">
        <span className="uppercase font-bold ">{title}</span>
        <span>{filteredDatas.length}</span>
      </div>

      {filteredDatas.length == 0 ? (
        <div
          className={`${
            hoverEmpty && "bg-gray-200"
          } min-h-20 cursor-grab active:cursor-grabbing select-none border-2 border-gray-300 p-2 m-2 rounded-xl`}
          onDrop={(e) => onEmpty(e)}
          onDragOver={dragOver}
          onDragEnter={() => setHoverEmpty(true)}
          onDragLeave={() => setHoverEmpty(false)}
        >
          <span>empty</span>
        </div>
      ) : (
        filteredDatas.map((d) => (
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
          hover && "bg-gray-200"
        } cursor-grab active:cursor-grabbing border-gray-300 border-2 p-2 m-2 rounded-xl min-h-20`}
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
