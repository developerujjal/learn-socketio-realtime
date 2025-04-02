import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {withCredentials: true});

const App = () => {
  // const socket = useMemo(() => {
  //   io("http://localhost:5000")
  // }, []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [chat, setChat] = useState([]);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('Jonin-room', roomName)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("id", socket.id);
    });

    socket.on("welcome", (data) => {
      console.log(data);
    });

    socket.on("hello", (data) => {
      console.log(data);
    });

    socket.on("msg-show", (data) => {
      // console.log(data);
      setChat([...chat, data]);
    });

    // return () => {
    //   socket.disconnect()
    // }
  }, [chat]);


  useEffect(() => {
    fetch('http://localhost:5000/login', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
      credentials: 'include'  // ✅ This is the correct way to send cookies
    })
    .then((res) => res.json())
    .then(data => console.log(data))
    .catch(err => console.error('Error:', err));
  }, []);
  

  return (
    <div>
      <form onSubmit={handleJoinRoom} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Type a Room name..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Join
          </button>
        </div>
      </form>
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
            placeholder="Type a room id..."
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

      <div>
        {chat.map((msg, index) => (
          <div key={index}>{msg.message}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
