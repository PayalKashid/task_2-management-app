import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() =>
            navigate("/projects")
          }
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Manage Projects
        </button>

        <button
          onClick={() =>
            navigate("/tasks")
          }
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Manage Tasks
        </button>
      </div>
    </div>
  );
}