import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/edit-item/:id" element={<EditItem />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
