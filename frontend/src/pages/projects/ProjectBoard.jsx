import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import api from "../../services/api";

export default function ProjectBoard() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/board/${id}`);
      setLists(res.data.lists || []);
    } catch (err) {
      console.error("Board Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveBoard = async (updatedLists) => {
    try {
      await api.put(`/board/${id}`, { lists: updatedLists });
    } catch (err) {
      console.error("Board Save Error:", err);
    }
  };

  // ✅ DRAG SAFE VERSION
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const updatedLists = lists.map((list) => ({
      ...list,
      cards: [...list.cards],
    }));

    const sourceList = updatedLists.find(
      (l) => l._id === source.droppableId
    );
    const destList = updatedLists.find(
      (l) => l._id === destination.droppableId
    );

    if (!sourceList || !destList) {
      console.warn("Drag error: list not found");
      return;
    }

    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);

    setLists(updatedLists);
    saveBoard(updatedLists);
  };

  const addList = () => {
    if (!newListName.trim()) return;

    const updated = [
      ...lists,
      { title: newListName, cards: [] },
    ];

    setLists(updated);
    setNewListName("");
    saveBoard(updated);
  };

  const addCard = (listId) => {
    const text = prompt("Enter task name");
    if (!text) return;

    const updated = lists.map((list) =>
      list._id === listId
        ? {
            ...list,
            cards: [...list.cards, { text }],
          }
        : list
    );

    setLists(updated);
    saveBoard(updated);
  };

  const deleteCard = (listId, cardId) => {
    if (!window.confirm("Delete this card?")) return;

    const updated = lists.map((list) =>
      list._id === listId
        ? {
            ...list,
            cards: list.cards.filter((c) => c._id !== cardId),
          }
        : list
    );

    setLists(updated);
    saveBoard(updated);
  };

  const deleteList = (listId) => {
    if (!window.confirm("Delete this list?")) return;

    const updated = lists.filter((list) => list._id !== listId);

    setLists(updated);
    saveBoard(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Project Board #{id}
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {lists.map((list) => (
            <motion.div
              key={list._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-80 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  {list.title}
                </h2>

                <FaTrash
                  className="text-red-400 hover:text-red-500 cursor-pointer"
                  onClick={() => deleteList(list._id)}
                />
              </div>

              <Droppable droppableId={list._id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3 min-h-[40px]"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable
                        key={card._id}
                        draggableId={card._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 border border-gray-600 px-3 py-2 rounded-lg flex justify-between items-center"
                          >
                            <span>{card.text}</span>

                            <FaTrash
                              className="text-red-400 hover:text-red-500 cursor-pointer"
                              onClick={() =>
                                deleteCard(list._id, card._id)
                              }
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
                onClick={() => addCard(list._id)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm flex gap-2 items-center"
              >
                <FaPlus /> Add Card
              </button>
            </motion.div>
          ))}

          {/* CREATE NEW LIST */}
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
              Create List
            </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
