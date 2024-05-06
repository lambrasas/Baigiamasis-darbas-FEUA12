import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ThreadsPage from "./pages/ThreadsPage";
import CreateThreadPage from "./pages/CreateThreadPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/threads" element={<ThreadsPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
      </Routes>
    </Router>
  );
};

export default App;
