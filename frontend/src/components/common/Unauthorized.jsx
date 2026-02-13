import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <h1 className="text-3xl font-bold text-red-400">Unauthorized</h1>
      <p className="text-gray-400 mt-2">
        You don't have permission to access this page.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
}
