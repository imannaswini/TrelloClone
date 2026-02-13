import { useParams } from "react-router-dom";

export default function ProjectMembers() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-8">
      <h1 className="text-3xl font-bold">
        Manage Members – Project #{id}
      </h1>

      <p className="text-gray-400 mt-2">
        Assign / remove members here.
      </p>
    </div>
  );
}
