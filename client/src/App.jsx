import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinRoom from "./pages/JoinRoom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Notes from "./pages/Notes";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/notes" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;