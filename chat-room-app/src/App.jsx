import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  // const socket = useMemo(() => {
  //   io("http://localhost:5000")
  // }, []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("hello", (data) => {
      console.log(data);
    });

    socket.on('msg-show', (data) => {
      console.log(data)
    })

    // return () => {
    //   socket.disconnect()
    // }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
