// src/components/chats/ChatBox.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { fetchAgentChats, fetchMessages } from "../../api/fetch";
import { sendMessage, initiateConversation } from "../../api/post";

export default function ChatBox({ agentId, customerId, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load conversations when component mounts
  useEffect(() => {
    const loadConversations = async () => {
      const res = await fetchAgentChats(agentId);
      if (res.status === "Success") {
        setConversations(res.conversations);
      }
    };
    loadConversations();
  }, [agentId]);

  // Load messages when active conversation changes
  useEffect(() => {
    const loadMessages = async () => {
      if (activeConversation) {
        const res = await fetchMessages(activeConversation.id);
        if (res.status === "Success") {
          setMessages(res.messages);
        }
      }
    };
    loadMessages();
  }, [activeConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    const result = await sendMessage(activeConversation.id, agentId, "agent", newMessage);
    console.log("Test result: ", result);
    setNewMessage("");
    const res = await fetchMessages(activeConversation.id);
    if (res.status === "Success") {
      setMessages(res.messages);
    }
  };

  const handleInitiate = async () => {
    const res = await initiateConversation(
      agentId,
      customerId,
      "Hello, how are you?",
    );
    if (res.status === "Success") {
      setActiveConversation({ id: res.conversation_id });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] bg-white rounded shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-2 border-b">
        <h3 className="font-semibold">
          {activeConversation
            ? `${activeConversation.first_name} ${activeConversation.last_name}`
            : "Conversations"}
        </h3>
        <FaTimes className="cursor-pointer text-gray-600" onClick={onClose} />
      </div>

      {!activeConversation ? (
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((c) => (
            <div
              key={c.id}
              className="p-2 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveConversation(c)}
            >
              {c.first_name} {c.last_name} — {c.last_message}
            </div>
          ))}
          <button
            onClick={handleInitiate}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Start New Conversation
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`mb-2 ${m.sender_role === "agent" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded ${
                    m.sender_role === "agent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.message}
                </span>
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded px-2 py-1 mr-2"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
