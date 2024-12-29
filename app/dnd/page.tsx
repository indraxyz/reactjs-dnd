"use client";

import {
  useState,
  DragEvent as DragEventReact,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "motion/react";
import { TODO } from "../../lib/mock-data";
import { MdDelete, MdDeleteForever, MdAddBox, MdClose } from "react-icons/md";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@nextui-org/react";

// BOARD COMPONENT
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

    setTodos([newTodo, ...todos]);
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
    <div className="p-4 min-h-screen">
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
// COLUMN COMPONENT
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

  // DELETE CARD DIRECT
  const deleteCard = (id: number) => {
    setDatas((pv) => pv.filter((c) => c.id !== id));
  };

  // separate base on type
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
            hoverEmpty ? "bg-gray-200" : "bg-gray-50"
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
            deleteCard={deleteCard}
          />
        ))
      )}
    </div>
  );
};

// CARD COMPONENT
type CardProps = {
  data: TodoProps;
  dragStart: (e: DragStartType, data: TodoProps) => void;
  dragOver: (e: DragEventReact) => void;
  dragEnd: (e: DragEventReact, idx: number) => void;
  deleteCard: (id: number) => void;
};
const Card = ({
  data,
  dragStart,
  dragOver,
  dragEnd,
  deleteCard,
}: CardProps) => {
  const [hover, setHover] = useState(false);
  const [mouseHover, setMouseHover] = useState(false);
  return (
    <div className="relative">
      <motion.div
        layout
        key={data.id}
        layoutId={`${data.id}`}
        draggable
        onDragStart={(e) => dragStart(e, data)}
        onDragOver={dragOver}
        onDrop={(e) => {
          setHover(false);
          dragEnd(e, data.id);
        }}
        onDragEnter={() => setHover(true)}
        onDragLeave={() => setHover(false)}
        onMouseOver={() => setMouseHover(true)}
        onMouseLeave={() => setMouseHover(false)}
        className={`${
          hover ? "bg-gray-200" : "bg-gray-50"
        }  cursor-grab active:cursor-grabbing border-gray-300 border-2 p-2 m-2 rounded-xl min-h-20`}
      >
        {mouseHover && (
          <MdClose
            className="absolute right-5 top-2 cursor-pointer hover:bg-gray-300 rounded-full text-xl hover:p-1"
            onClick={() => deleteCard(data.id)}
          />
        )}

        {data.message}
      </motion.div>
    </div>
  );
};
