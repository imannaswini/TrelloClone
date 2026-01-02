import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ProjectBoard() {
  const { id } = useParams();

  const [lists, setLists] = useState([
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "1", text: "Setup project repo" },
        { id: "2", text: "Discuss UI design" },
      ],
    },
    {
      id: "progress",
      title: "In Progress",
      cards: [{ id: "3", text: "Building dashboard UI" }],
    },
    {
      id: "done",
      title: "Completed",
      cards: [{ id: "4", text: "Requirement analysis complete" }],
    },
  ]);

  const [newListName, setNewListName] = useState("");

  // Drag Handling
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedLists = [...lists];

    const sourceList = updatedLists.find((l) => l.id === source.droppableId);
    const destList = updatedLists.find((l) => l.id === destination.droppableId);

    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);

    setLists(updatedLists);
  };

  // Add List
  const addList = () => {
    if (!newListName.trim()) return;

    setLists([
      ...lists,
      {
        id: Date.now().toString(),
        title: newListName,
        cards: [],
      },
    ]);

    setNewListName("");
  };

  // Add Card
  const addCard = (listId) => {
    const text = prompt("Enter task name");
    if (!text) return;

    setLists(
      lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [...list.cards, { id: Date.now().toString(), text }],
            }
          : list
      )
    );
  };

  // Delete Card
  const deleteCard = (listId, cardId) => {
    if (!window.confirm("Delete this card?")) return;

    setLists(
      lists.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
          : list
      )
    );
  };

  // ✅ DELETE LIST FUNCTION
  const deleteList = (listId) => {
    if (!window.confirm("Are you sure you want to delete this entire list?")) return;

    setLists(lists.filter((list) => list.id !== listId));
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6">
      <h1 className="text-3xl font-heading font-bold mb-4">
        Project Board #{id}
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">

          {lists.map((list) => (
            <motion.div
              key={list.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-80 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header + Delete List Button */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{list.title}</h2>

                <FaTrash
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                  onClick={() => deleteList(list.id)}
                  title="Delete List"
                />
              </div>

              <Droppable droppableId={list.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 min-h-[50px]"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg flex justify-between items-center"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <span>{card.text}</span>

                            <FaTrash
                              className="text-red-400 cursor-pointer hover:text-red-500"
                              onClick={() => deleteCard(list.id, card.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                onClick={() => addCard(list.id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm flex gap-2 items-center"
              >
                <FaPlus /> Add Card
              </button>
            </motion.div>
          ))}

          {/* Create New List */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 w-80 h-fit">
            <h2 className="text-lg mb-2">Create New List</h2>

            <input
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none"
              placeholder="Enter list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />

            <button
              onClick={addList}
              className="mt-3 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg w-full"
            >
              Create
            </button>
          </div>

        </div>
      </DragDropContext>
    </div>
  );
}
