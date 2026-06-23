import { useEffect, useState } from "react";
import api from "../api/axios";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
}

export default function Tasks() {
  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState(""); 

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [editTask, setEditTask] = useState({
   title: "",
   description: "",
   priority: "Medium",
   due_date: "",
});

  const [skip, setSkip] = useState(0);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    due_date: "",
    project_id: "",
  });

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data);

      if (
        response.data.length > 0 &&
        !newTask.project_id
      ) {
        setNewTask((prev) => ({
          ...prev,
          project_id: response.data[0].id,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
  status: statusFilter || undefined,
  priority: priorityFilter || undefined,
  
  skip,
  limit: 5,
},
      });

      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };


  const createTask = async () => {
    try {
      await api.post(
        `/tasks/projects/${newTask.project_id}/tasks`,
        {
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          due_date: newTask.due_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewTask({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        due_date: "",
        project_id:
          projects.length > 0
            ? projects[0].id
            : "",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Failed to create task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (
    taskId: string,
    status: string
  ) => {
    try {
      await api.patch(
        `/tasks/${taskId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };
   const updateTask = async (taskId: string) => {
    try {
    await api.put(
      `/tasks/${taskId}`,
      {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        due_date: editTask.due_date,
      }
    );

    setEditingTask(null);
    fetchTasks();
  } catch (error) {
    console.error(error);
    alert("Failed to update task");
  }
};
   const filteredTasks = tasks.filter((task) =>
  (task.title || "")
    .toLowerCase()
    .includes((search || "").toLowerCase())
);

const displayedTasks = [...filteredTasks];

if (sortOrder === "asc") {
  displayedTasks.sort(
    (a, b) =>
      new Date(a.due_date || "").getTime() -
      new Date(b.due_date || "").getTime()
  );
}

if (sortOrder === "desc") {
  displayedTasks.sort(
    (a, b) =>
      new Date(b.due_date || "").getTime() -
      new Date(a.due_date || "").getTime()
  );
}


useEffect(() => {
  fetchTasks();
  fetchProjects();
}, [statusFilter, priorityFilter, skip]);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Tasks
      </h1> 

      {/* Create Task */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">
          Create Task
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                title: e.target.value,
              })
            }
            className="border p-2 rounded"
          />
          

          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                description: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={newTask.due_date}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                due_date: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <select
            value={newTask.project_id}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                project_id: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={newTask.status}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                status: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <button
          onClick={createTask}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Create Task
        </button>
      </div>

         <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 mb-4 w-full"
/>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border rounded px-3 py-2"
        >
          <option value="">
            All Status
          </option>
          <option value="Pending">
            Pending
          </option>
          <option value="In Progress">
            In Progress
          </option>
          <option value="Completed">
            Completed
          </option>
        </select>

        <select
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
  className="border rounded px-3 py-2"
>
  <option value="">Sort by Due Date</option>
  <option value="asc">Oldest First</option>
  <option value="desc">Newest First</option>
</select>

        <select
    value={priorityFilter}
    onChange={(e) =>
      setPriorityFilter(e.target.value)
    }
    className="border rounded px-3 py-2"
  >
    <option value="">All Priority</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  </div>

      {/* Task List */}
      <div className="space-y-4">
        {displayedTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          displayedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between"
            >
              <div>
                {editingTask === task.id ? (
  <>
    <input
      type="text"
      value={editTask.title}
      onChange={(e) =>
        setEditTask({
          ...editTask,
          title: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />
    

    <input
      type="text"
      value={editTask.description}
      onChange={(e) =>
        setEditTask({
          ...editTask,
          description: e.target.value,
        })
      }
      className="border p-2 rounded w-full mb-2"
    />
  </>
) : (
  <>
    <h2 className="font-bold text-xl">
      {task.title}
    </h2>

    <p>{task.description}</p>
  </>
)}

                <div className="mt-2">
                  <label>Status:</label>

                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(
                        task.id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 ml-2"
                  >
                    <option>
                      Pending
                    </option>
                    <option>
                      In Progress
                    </option>
                    <option>
                      Completed
                    </option>
                  </select>
                </div>

                <p>
                  Priority: {task.priority}
                </p>

                <p>
                  Due Date:{" "}
                  {new Date(
                    task.due_date
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
  {editingTask === task.id ? (
    <button
      onClick={() => updateTask(task.id)}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Save
    </button>
  ) : (
    <button
      onClick={() => {
        setEditingTask(task.id);

        setEditTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date
            ? task.due_date.split("T")[0]
            : "",
        });
      }}
      className="bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Edit
    </button>
  )}

  <button
    onClick={() => deleteTask(task.id)}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Delete
  </button>
</div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-6">
        <button
          disabled={skip === 0}
          onClick={() =>
            setSkip(skip - 5)
          }
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() =>
            setSkip(skip + 5)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
