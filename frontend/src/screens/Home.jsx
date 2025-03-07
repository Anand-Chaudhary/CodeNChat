import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import {useNavigate} from 'react-router-dom'

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projects, setProjects] = useState([])

  function createProject(e) {
    e.preventDefault();
    console.log("Project Created:", projectName);
    axiosInstance.post('/projects/create', {
      name: projectName,
    }).then((res) => {
      console.log('Project created:', res.data);
    }).catch((err) => {
      console.error(err);
    })
    setIsModalOpen(false);
  }

  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get('/projects/all').then((res) => {
      console.log('Projects:', res.data);
      setProjects(res.data.allUserProjects);
    }).catch((err) => {
      console.error(err);
    })
  }, [])

  return (
    <main className="min-h-screen p-4 bg-zinc-900 text-white">
      <div className="projects flex flex-wrap gap-4">
        <button
          className="project p-4 text-lg border-2 border-white rounded-lg mb-4 hover:bg-zinc-600"
          onClick={() => setIsModalOpen(true)}
        >Create New Project
          <i className="ri-link font-medium p-2 ml-2"></i>
        </button>

        {
          projects.map((project) => (
            <>
              <div
                key={project._id}
                onClick={() => {
                  navigate(`/project`, {
                    state: { project }
                  })
                }}
                className="project min-w-52 p-4 flex flex-col cursor-pointer border-2 border-white rounded-lg mb-4 hover:bg-zinc-600">
                <h2 className='text-xl tracking-tighter'>{project.name}</h2>
                <div className="flex gap-2"><p><i class="ri-user-3-line"></i><small>Collaborators: </small> </p>{project.users.length}</div>
              </div>

            </>
          ))
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={createProject}
            className="bg-zinc-800 p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Create Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              className="w-full p-2 mb-4 border border-gray-500 rounded bg-zinc-700 text-white"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-red-500 rounded text-white"
                onClick={() => setIsModalOpen(false)}
              >Cancel</button>
              <button
                className="px-4 py-2 bg-green-500 rounded text-white"
                onClick={createProject}
              >Create</button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default Home