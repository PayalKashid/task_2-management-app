import { useEffect, useState } from "react";
import api from "../api/axios";

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post(
        "/projects",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  const updateProject = async (projectId: string) => {
  try {
    await api.put(`/projects/${projectId}`, {
      name: editName,
      description: editDescription,
    });

    setEditingProject(null);

    fetchProjects();
  } catch (error) {
    console.error("Error updating project:", error);
    alert("Failed to update project");
  }
};

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Projects
      </h1>

      {/* Create Project */}
      <form
        onSubmit={createProject}
        className="bg-white shadow rounded-lg p-4 mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </form>

      {/* Project List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow rounded-lg p-4 flex justify-between"
          >
            <div>
  {editingProject === project.id ? (
    <>
      <input
        type="text"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-2"
      />

      <textarea
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </>
  ) : (
    <>
      <h2 className="font-bold text-xl">
        {project.name}
      </h2>

      <p>{project.description}</p>
    </>
  )}
</div>

            <div className="flex gap-2">
  {editingProject === project.id ? (
    <button
      onClick={() => updateProject(project.id)}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Save
    </button>
  ) : (
    <button
      onClick={() => {
        setEditingProject(project.id);
        setEditName(project.name);
        setEditDescription(project.description || "");
      }}
      className="bg-yellow-500 text-white px-4 py-2 rounded"
    >
      Edit
    </button>
  )}

  <button
    onClick={() => deleteProject(project.id)}
    className="bg-red-600 text-white px-4 py-2 rounded"
  >
    Delete
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}