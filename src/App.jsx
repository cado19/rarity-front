import { useEffect, useState } from "react";
import "./App.css";
import AppRouter from "./components/router";
import { ChatProvider } from "./context/ChatContext";

function App() {
  const [count, setCount] = useState(0);

  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setAgent(JSON.parse(stored));
    }
  }, []);

  return (
    <>
      <ChatProvider agentId={agent?.id}>
        <AppRouter />
      </ChatProvider>
    </>
  );
}

export default App;
