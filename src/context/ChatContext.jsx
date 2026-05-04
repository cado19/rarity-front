import React, { createContext, useContext, useEffect, useState } from "react";
// import ChatBox from "./ChatBox";
import ChatBox from "../components/chats/Chatbox";
import { fetchAgentChats, fetchAgentUnread } from "../api/fetch";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children, agentId }) => {
  const [open, setOpen] = useState(false);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // count for unread messages

  const toggleChat = () => setOpen((prev) => !prev);
  const closeChat = () => setOpen(false);
  const openChatWithCustomer = (customerId) => {
    setActiveCustomerId(customerId);
    setOpen(true);
  };

  useEffect(() => {
    if (!agentId) return;
    const pollUnread = async () => {
      const res = await fetchAgentChats(agentId);
      if (res.status === "Success") {
       // compute unread count
          const unreadData = await fetchAgentUnread(agentId);
          // console.log("Unread data: ", unreadData);
          if (unreadData.status === "Success") {
            setUnreadCount(unreadData.total_unread);
          }
      }
    };
    pollUnread();
    const interval = setInterval(pollUnread, 3000);
    return () => clearInterval(interval);
  }, [agentId]);

  return (
    <ChatContext.Provider
      value={{ open, toggleChat, closeChat, openChatWithCustomer, unreadCount }}
    >
      {children}
      {open && (
        <ChatBox
          agentId={agentId}
          customerId={activeCustomerId}
          onClose={closeChat}
        />
      )}
    </ChatContext.Provider>
  );
};
