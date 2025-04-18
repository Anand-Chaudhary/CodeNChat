import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";

const Project = () => {
  const location = useLocation();
  console.log(location.state);
  const [isSidePannelOpen, setIsSidePannelOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);

  // Updated useEffect to better handle the user fetching
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/users/all-users');
        console.log('Users response:', response.data); // Debug log
        // Assuming the response has users array directly or nested
        const fetchedUsers = response.data.users || response.data;
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Add new useEffect to fetch project users
  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const response = await axiosInstance.get(`/projects/get-project/${location.state.project._id}`);
        console.log('Project data:', response.data);
        setProjectUsers(response.data.users || []);
      } catch (err) {
        console.error('Error fetching project users:', err);
      }
    };

    fetchProjectUsers();
  }, [location.state.project._id, isAddUserModalOpen]); // Refetch when users are added

  // Updated handleUserSelect function with better logging
  const handleUserSelect = (userId) => {
    console.log('Selecting user:', userId); // Debug log
    setSelectedUsers(prev => {
      const newSelection = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      console.log('Updated selection:', newSelection); // Debug log
      return newSelection;
    });
  };

  // Updated handleAddUsers function with better error handling
  const handleAddUsers = async () => {
    if (!selectedUsers.length) return;

    try {
      console.log('Sending selected users:', selectedUsers); // Debug log
      const response = await axiosInstance.put(`/projects/add-user`, {
        users: selectedUsers
      });
      
      console.log('Users added successfully:', response.data);
      // Show success message or update UI
      setIsAddUserModalOpen(false);
      setSelectedUsers([]); // Clear selection
      
      // Optionally refresh the project users list
      // You might want to add a function to fetch and update the project users
      
    } catch (error) {
      console.error('Error adding users:', error);
      // Show error message to user
    }
  };

  return (
    <main className="w-screen h-screen flex bg-zinc-800">
      <section className="left relative h-full min-w-95 flex flex-col bg-purple-300">
        <header className="flex bg-white justify-between items-center p-2 px-4 w-full">
          <h1>{Project.name}</h1>
          <button
            onClick={() => setIsSidePannelOpen(!isSidePannelOpen)}
            className="p-2 rounded-lg border border-gray-400"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversationArea flex-grow flex flex-col p-3">
          <div className="message-area flex flex-col gap-2 flex-grow">
            {/* Message 1 */}
            <div className="message max-w-56 p-2 bg-white w-fit rounded-lg flex flex-col gap-1">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit. Dolorem.
              </p>
            </div>

            {/* Message 2 */}
            <div className="ml-auto message max-w-56 p-2 bg-white w-fit rounded-lg flex flex-col gap-1">
              <small className="opacity-65 text-xs">example@gmail.com</small>
              <p className="text-sm">
                Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Maiores.
              </p>
            </div>
          </div>

          {/* Input Field */}
          <div className="input-field w-full gap-2 p-1 bg-white rounded-full flex justify-evenly">
            <input
              type="text"
              className="p-2 px-8 border-none outline-none"
              placeholder="Enter Your Message...."
            />
            <button className="bg-purple-700 flex justify-center items-center rounded-full flex-grow p-1">
              <i className="ri-send-plane-fill text-white flex justify-center items-center"></i>
            </button>
          </div>
        </div>

        <div
          className={`side-pannel w-full h-full z-1 bg-purple-300 absolute top-0 left-0 transition-all duration-300 ${
            isSidePannelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex bg-white justify-between items-center p-2 px-4 w-full">
            <h1 className="text-xl font-bold">Project Collaborators</h1>
            <button
              onClick={() => setIsSidePannelOpen(false)}
              className="p-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            >
              <i className="ri-close-line"></i>
            </button>
          </header>
          
          <div className="users flex flex-col gap-2 p-2">
            {/* Collaborators List */}
            <div className="collaborators space-y-2">
              {projectUsers.map(user => (
                <div 
                  key={user._id}
                  className="user flex items-center gap-3 bg-white p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
                    <i className="ri-user-3-fill text-white text-lg"></i>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{user.email}</p>
                    <p className="text-sm text-gray-500">Collaborator</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Users Button */}
            <div className="add mt-4">
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="w-full p-3 bg-purple-500 flex justify-center items-center text-white rounded-lg hover:bg-purple-600 transition-colors gap-2"
              >
                <i className="ri-user-add-line text-xl"></i>
                <span className="font-semibold">Add Collaborators</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[450px] max-h-[80vh] shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Add Team Members</h2>
                <button 
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <i className="ri-close-line text-xl text-gray-600 hover:text-gray-800"></i>
                </button>
              </div>
              
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">{error}</div>
                ) : users.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">No users found</div>
                ) : (
                  users.map(user => (
                    <div 
                      key={user._id}
                      onClick={() => handleUserSelect(user._id)}
                      className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-200 hover:shadow-md
                        ${selectedUsers.includes(user._id) 
                          ? 'bg-purple-50 border-2 border-purple-500 shadow-purple-100' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                        <i className="ri-user-3-fill text-white text-lg"></i>
                      </div>
                      <div className="flex-grow">
                        <span className="font-medium text-gray-800">{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        {selectedUsers.includes(user._id) ? (
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                            <i className="ri-check-line text-white"></i>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={()=>{
                    handleAddUsers(), setIsAddUserModalOpen(false)
                  }}
                  disabled={selectedUsers.length === 0}
                  className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200
                    ${selectedUsers.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed opacity-60' 
                      : 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-200'}`}
                >
                  Add {selectedUsers.length} {selectedUsers.length === 1 ? 'Member' : 'Members'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Project;
