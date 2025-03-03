import React, { useState } from 'react'
import axiosInstance from '../config/axios'

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")

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

  return (
    <main className="min-h-screen p-4 bg-zinc-900 text-white">
      <div className="projects">
        <button 
          className="project p-4 border-2 border-white rounded-lg mb-4 hover:bg-zinc-600"
          onClick={() => setIsModalOpen(true)}
        >Create New Project
          <i className="ri-link font-medium p-2 ml-2"></i>
        </button>
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