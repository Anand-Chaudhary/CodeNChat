import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();
  console.log(location.state);
  const [isSidePannelOpen, setIsSidePannelOpen] = useState(false);

  return (
    <main className="w-screen h-screen flex bg-zinc-800">
      <section className="left relative h-full min-w-95 flex flex-col bg-purple-300">
        {/* Header */}
        <header className="flex bg-slate-200 justify-between items-center p-2 px-4 w-full">
          <h1>{Project.name}</h1>
          <button
            onClick={() => setIsSidePannelOpen(!isSidePannelOpen)}
            className="p-2 rounded-lg border border-gray-400"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        {/* Chat Area */}
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
            <button className="bg-purple-700 flex justify-center items-center rounded-full flex-grow">
              <i className="ri-send-plane-fill text-white"></i>
            </button>
          </div>
        </div>

        {/* Side Panel (FIXED) */}
        <div
          className={`side-pannel w-full h-full bg-purple-300 absolute top-0 left-0 transition-all duration-300 ${
            isSidePannelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setIsSidePannelOpen(false)}
            className="absolute top-2 right-2 p-2 bg-white rounded-full"
          >
            ❌
          </button>
        </div>
      </section>
    </main>
  );
};

export default Project;
