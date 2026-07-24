import { BrowserRouter, Routes, Route } from "react-router-dom";

import JoinRoom from "./pages/JoinRoom";
import Home from "./pages/Home";
import Room from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/notes" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;