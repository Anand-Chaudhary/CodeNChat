import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import { UserContext } from "../context/User.Context.jsx";
import Markdown from "markdown-to-jsx";
import rehypeHighlight from "rehype-highlight";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Add check for user authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  console.log(location.state);
  const [isSidePannelOpen, setIsSidePannelOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectUsers, setProjectUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({})
  const [fileContent, setFileContent] = useState('');
  const [currentFile, setCurrentFile] = useState(null)
  const [openFiles, setOpenFiles] = useState([]);

  const messageBox = React.createRef();

  // Add function to handle file opening
  const handleFileOpen = (fileName) => {
    setCurrentFile(fileName);
    if (!openFiles.includes(fileName)) {
      setOpenFiles(prev => [...prev, fileName]);
    }
    // Set the file content when opening a file
    if (fileTree[fileName]?.file?.contents) {
      setFileContent(fileTree[fileName].file.contents);
    }
  };

  // Add function to handle file closing
  const handleFileClose = (fileName) => {
    setOpenFiles(prev => prev.filter(file => file !== fileName));
    if (currentFile === fileName) {
      setCurrentFile(openFiles.length > 1 ? openFiles[0] : null);
    }
  };

  // Updated useEffect to better handle the user fetching
  useEffect(() => {

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/users/all-users');
        console.log('Users response:', response.data);

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
        // Update both project users and file tree
        setProjectUsers(response.data.users || []);
        if (response.data.fileTree) {
          setFileTree(response.data.fileTree);
        }
      } catch (err) {
        console.error('Error fetching project users:', err);
      }
    };

    fetchProjectUsers();
  }, [location.state.project._id]); // Only fetch on initial load

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

  // Update handleAddUsers function
  const handleAddUsers = async () => {
    if (!selectedUsers.length) return;

    try {
      console.log('Sending selected users:', selectedUsers);
      const response = await axiosInstance.put(`/projects/add-user`, {
        projectId: location.state.project._id,
        users: selectedUsers
      });

      console.log('Users added successfully:', response.data);
      setIsAddUserModalOpen(false);
      setSelectedUsers([]);

      // Update project users with the new data
      setProjectUsers(response.data.users || []);

    } catch (error) {
      console.error('Error adding users:', error);
      setError('Failed to add users. Please try again.');
    }
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  function scrollToBottom() {
    const messageBox = document.querySelector('.message-area');
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  // Update the socket event listener to handle file tree updates
  useEffect(() => {
    const socket = initializeSocket(location.state.project._id);

    receiveMessage('project-message', (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, data]);
      
      if (data.message?.fileTree) {
        const fileTreeArray = data.message.fileTree;
        if (Array.isArray(fileTreeArray)) {
          const newFileTree = {};
          fileTreeArray.forEach(file => {
            newFileTree[file.path] = {
              file: {
                contents: file.content
              }
            };
          });
          setFileTree(newFileTree);
          
          if (currentFile && newFileTree[currentFile]?.file?.contents) {
            setFileContent(newFileTree[currentFile].file.contents);
          }
        } else {
          setFileTree(data.message.fileTree);
          if (currentFile && data.message.fileTree[currentFile]?.file?.contents) {
            setFileContent(data.message.fileTree[currentFile].file.contents);
          }
        }
      }

      if (data.message?.users) {
        setProjectUsers(data.message.users);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [location.state.project._id, currentFile]);

  const writeAIMessage = (data) => {
    let messageContent;

    try {
      // Handle both string and object inputs
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          messageContent = parsed.message || parsed.text || data;
        } catch {
          messageContent = data;
        }
      } else if (typeof data === 'object') {
        messageContent = data.message || data.text || JSON.stringify(data);
      } else {
        messageContent = String(data);
      }

      return (
        <div className="overflow-auto custom-scrollbar">
          <Markdown
            options={{
              overrides: {
                code: {
                  component: ({ children, ...props }) => (
                    <code {...props} className="hljs">
                      {children}
                    </code>
                  ),
                },
              },
            }}
            rehypePlugins={[rehypeHighlight]}
          >
            {messageContent}
          </Markdown>
        </div>
      );
    } catch (error) {
      console.error('Error rendering AI message:', error);
      return <div className="text-red-500">Error displaying message</div>;
    }
  };

  const send = () => {
    if (!message.trim()) return;
    if (!user || !user.id) {
      console.error('User not authenticated');
      return;
    }

    const messageObject = {
      message,
      sender: user.id,
      timestamp: new Date().toISOString()
    };

    sendMessage('project-message', messageObject);

    setMessages(prev => [...prev, messageObject]); // add to state

    setMessage('');
  };

  // Add function to handle file content updates
  const handleFileContentUpdate = (fileName, content) => {
    const updatedFileTree = {
      ...fileTree,
      [fileName]: {
        file: {
          contents: content
        }
      }
    };
    
    // Update local state first
    setFileTree(updatedFileTree);
    setFileContent(content);
    
    // Send update to backend
    sendMessage('project-message', {
      message: `Updated file: ${fileName}`,
      sender: user.id,
      fileTree: updatedFileTree
    });
  };

  return (
    <main className="w-full h-screen flex bg-zinc-800">
      <section className="left relative h-full min-w-95 flex flex-col bg-purple-300">
        <header className="flex bg-white justify-between items-center p-2 px-4 w-full absolute top-0 z-10">
          <h1>{location.state.project.name}</h1>
          <button
            onClick={() => setIsSidePannelOpen(!isSidePannelOpen)}
            className="p-2 rounded-lg border border-gray-400"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversationArea pt-16 flex flex-col h-full p-3 relative">
          <div
            ref={messageBox}
            className="message-area flex flex-col gap-2 flex-1 overflow-y-auto mb-2"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message p-2 bg-white w-fit rounded-lg flex flex-col gap-1 ${msg.sender === "AI"
                  ? "bg-zinc-900 text-white max-w-80"
                  : "max-w-56"
                  } ${msg.sender === user.id && "ml-auto"}`}
              >
                <small className="opacity-65 text-xs">
                  {msg.sender === user.id ? "You" : msg.sender}
                </small>
                {msg.sender === "AI" ? (
                  writeAIMessage(msg.message)
                ) : (
                  <p className="text-sm">{msg.message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="input-field w-full gap-2 p-1 bg-white rounded-full flex justify-evenly sticky bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="p-2 px-8 border-none outline-none"
              placeholder="Enter Your Message...."
            />
            <button
              className="bg-purple-700 flex justify-center items-center rounded-full flex-grow p-1"
              onClick={send}
            >
              <i className="ri-send-plane-fill text-white flex justify-center items-center"></i>
            </button>
          </div>
        </div>

        <div
          className={`side-pannel w-full h-full z-1 bg-purple-300 absolute top-0 left-0 transition-all duration-300 ${isSidePannelOpen ? "translate-x-0" : "-translate-x-full"
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
              {projectUsers.map((user) => (
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
      </section>
      <section className="right rounded-lg mb-2 p-2 flex-grow h-full flex">
        <div className="explorer w-64 bg-zinc-900 h-full max-w-72 py-2">
          <div className="fileTree flex flex-col gap-2">
            {Object.keys(fileTree).map((fileName) => (
              <div key={fileName} className="file-item p-4 mb-2 bg-white hover:bg-purple-200 cursor-pointer">
                <button
                  onClick={() => {
                    handleFileOpen(fileName);
                    console.log('Selected file:', fileName);
                  }}
                  className="flex items-center w-full"
                >
                  <i className="ri-file-text-line"></i>
                  <span className="ml-2">{fileName}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="codeEditor p-2 flex-grow h-full flex flex-col">
          {openFiles.length > 0 && (
            <>
              <div className="flex gap-2 border-b">
                {openFiles.map((file) => (
                  <button
                    onClick={() => handleFileOpen(file)}
                    key={file}
                    className={`codeEditorHeader flex items-center gap-2 px-4 py-2 cursor-pointer ${currentFile === file ? 'bg-white' : 'bg-gray-100'
                      }`}
                  >
                    <h3 className="text-lg font-semibold">{file}</h3>
                    <button
                      onClick={() => handleFileClose(file)}
                      className="p-1 rounded-md hover:bg-gray-200"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </button>
                ))}
              </div>
              <textarea
                className="codeEditorContent p-4 bg-zinc-900 text-white flex-grow font-mono resize-none outline-none"
                value={fileContent || ''}
                onChange={(e) => {
                  handleFileContentUpdate(currentFile, e.target.value);
                  // You might want to emit this change to the backend here
                  sendMessage('file-content-update', {
                    fileName: currentFile,
                    content: e.target.value
                  });
                }}
              />
            </>
          )}
        </div>
      </section>
      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[450px] max-h-[80vh] shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Add Team Members
              </h2>
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
                <div className="text-gray-500 text-center py-4">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                    className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 transition-all duration-200 hover:shadow-md ${selectedUsers.indexOf(user._id) !== -1
                      ? "bg-purple-50 border-2 border-purple-500 shadow-purple-100"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                      <i className="ri-user-3-fill text-white text-lg"></i>
                    </div>
                    <div className="flex-grow">
                      <span className="font-medium text-gray-800">
                        {user.email}
                      </span>
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
                onClick={() => {
                  handleAddUsers(), setIsAddUserModalOpen(false);
                }}
                disabled={selectedUsers.length === 0}
                className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${selectedUsers.length === 0
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-purple-200"
                  }`}
              >
                Add {selectedUsers.length}{" "}
                {selectedUsers.length === 1 ? "Member" : "Members"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;