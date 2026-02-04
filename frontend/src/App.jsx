import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostList from "./pages/PostList";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
