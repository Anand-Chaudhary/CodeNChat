import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasProjects, setHasProjects] = useState(null)
  const navigate = useNavigate()

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/projects/all');

      if (res.data?.allUserProjects && res.data.allUserProjects.length > 0) {
        setProjects(res.data.allUserProjects);
        setHasProjects(true);
        setError(null);
      } else {
        setProjects([]);
        setHasProjects(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
      setHasProjects(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [])

  async function createProject(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/projects/create', {
        name: projectName,
      });

      // Reset form and close modal
      setProjectName("");
      setIsModalOpen(false);

      // Fetch the latest projects list
      await fetchProjects();
    } catch (err) {
      console.error(err);
      setError('Failed to create project. Please try again.');
    }
  }

  return (
    <main className="min-h-screen p-4 bg-zinc-900 text-white">
      {isLoading || hasProjects === null ? (
        <div className="w-full flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="projects flex flex-wrap gap-4">
          <button
            className="project p-4 text-lg border-2 border-white rounded-lg mb-4 hover:bg-zinc-600"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Project
            <i className="ri-link font-medium p-2 ml-2"></i>
          </button>

          {error ? (
            <div className="w-full p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          ) : !hasProjects ? (
            <div className="w-full p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
              <p className="text-zinc-400">No projects found. Create a new project to get started!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                onClick={() => {
                  navigate(`/project`, {
                    state: { project }
                  })
                }}
                className="project min-w-52 p-4 flex flex-col cursor-pointer border-2 border-white rounded-lg mb-4 hover:bg-zinc-600"
              >
                <h2 className='text-xl tracking-tighter'>{project.name}</h2>
                <div className="flex gap-2">
                  <p><i className="ri-user-3-line"></i><small>Collaborators: </small></p>
                  {project.users.length}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="modal-content bg-zinc-800 p-4 rounded-lg">
            <h2 className="text-xl mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
                className="w-full p-2 mb-4 border border-white rounded-lg"
                required
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Create</button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-red-500 text-white p-2 rounded-lg"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home