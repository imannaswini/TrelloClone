import { useParams } from "react-router-dom";

export default function ProjectBoard() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold">
        Project Board #{id}
      </h1>

      <p className="text-gray-400 mt-2">
        Trello-style board will be implemented here.
      </p>
    </div>
  );
}
