import theme from "./mui-theme";
import "./App.css";

import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Views/Homepage";
import Ticket from "./Views/Ticket";
import Login from "./Views/Login";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { useRef } from "react";

function App() {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Homepage />}></Route>
          <Route path="/ticket/:ticketId" element={<Ticket />}></Route>
        </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
