import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, MoreHorizontal, Calendar, ArrowLeft, GripVertical, AlertCircle } from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";

export default function ProjectBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoard();
  }, []);

  const fetchBoard = async () => {
    try {
      const res = await api.get(`/board/${projectId}`);
      setLists(res.data.lists || []);
    } catch (err) {
      console.error("Board Load Error:", err);
      toast.error("Failed to load project board");
    } finally {
      setLoading(false);
    }
  };

  const saveBoard = async (updatedLists) => {
    try {
      await api.put(`/board/${projectId}`, { lists: updatedLists });
    } catch (err) {
      console.error("Board Save Error:", err);
      toast.error("Failed to save board state");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const updatedLists = lists.map((list) => ({
      ...list,
      cards: [...list.cards],
    }));

    const sourceList = updatedLists.find((l) => l._id === source.droppableId);
    const destList = updatedLists.find((l) => l._id === destination.droppableId);

    if (!sourceList || !destList) return;

    const [movedCard] = sourceList.cards.splice(source.index, 1);
    destList.cards.splice(destination.index, 0, movedCard);

    setLists(updatedLists);
    saveBoard(updatedLists);
  };

  const addList = () => {
    if (!newListName.trim()) return;

    const updated = [
      ...lists,
      { _id: `temp_${Date.now()}`, title: newListName, cards: [] }, // Using temp ID until backend syncs, realistically needs real backend response handling but we keep it simple per existing logic
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
            cards: [...list.cards, { _id: `temp_card_${Date.now()}`, text, priority: "normal", tags: ["Frontend"] }],
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

  const getPriorityBadge = (priority) => {
    switch(priority?.toLowerCase()) {
      case "high": return <Badge variant="danger" className="text-[10px] py-0.5 px-1.5 h-auto">High</Badge>;
      case "low": return <Badge variant="success" className="text-[10px] py-0.5 px-1.5 h-auto">Low</Badge>;
      default: return <Badge variant="secondary" className="text-[10px] py-0.5 px-1.5 h-auto">Normal</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex gap-6 overflow-x-auto p-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-80 h-[500px] shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Board</h1>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {lists.map((list) => (
            <div
              key={list._id}
              className="w-[320px] shrink-0 flex flex-col glass-panel rounded-2xl border border-white/5 max-h-full"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  {list.title}
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                    {list.cards.length}
                  </span>
                </h2>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => addCard(list._id)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    onClick={() => deleteList(list._id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <Droppable droppableId={list._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 space-y-3 overflow-y-auto min-h-[150px] transition-colors duration-200 ${
                      snapshot.isDraggingOver ? "bg-primary-500/5" : ""
                    }`}
                  >
                    {list.cards.map((card, index) => (
                      <Draggable key={card._id} draggableId={card._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                            className={`group relative bg-zinc-900/80 border border-white/10 rounded-xl p-3.5 shadow-lg flex flex-col gap-3 transition-all duration-200 ${
                              snapshot.isDragging ? "shadow-2xl shadow-primary-500/20 ring-1 ring-primary-500 scale-[1.02] z-50" : "hover:border-white/20"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex flex-wrap gap-1.5 mb-1">
                                {getPriorityBadge(card.priority || "normal")}
                                {card.tags?.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-[10px] py-0.5 px-1.5 h-auto text-zinc-400 border-zinc-700">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <button 
                                onClick={() => deleteCard(list._id, card._id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <p className="text-sm text-zinc-200 leading-snug break-words">
                              {card.text}
                            </p>

                            <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Calendar size={12} />
                                <span>{card.dueDate ? new Date(card.dueDate).toLocaleDateString() : 'No date'}</span>
                              </div>
                              
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-primary-600 border border-zinc-900 flex items-center justify-center text-[10px] text-white font-medium shadow-sm">
                                  {card.assignee ? card.assignee.charAt(0).toUpperCase() : "?"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              <div className="p-3 border-t border-white/5">
                <Button 
                  variant="ghost" 
                  className="w-full text-zinc-400 hover:text-white hover:bg-white/5 border border-dashed border-zinc-700 h-9"
                  onClick={() => addCard(list._id)}
                >
                  <Plus size={16} className="mr-1.5" /> Add Task
                </Button>
              </div>
            </div>
          ))}

          {/* New List Form */}
          <div className="w-[320px] shrink-0 h-fit glass-panel rounded-2xl border border-white/5 p-3">
            <div className="flex gap-2">
              <Input
                placeholder="New list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="bg-zinc-900/50"
              />
              <Button onClick={addList} className="px-3 shrink-0">
                <Plus size={18} />
              </Button>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
