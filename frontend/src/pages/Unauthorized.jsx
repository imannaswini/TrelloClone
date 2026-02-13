export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 border border-slate-700 p-10 rounded-xl text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-3">
          Access Denied 🚫
        </h1>
        <p className="text-slate-400">
          You are not authorized to view this page.
        </p>
      </div>
    </div>
  );
}
