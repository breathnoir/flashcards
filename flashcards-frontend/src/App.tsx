import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import ExplorePage from "./pages/ExplorePage";
import CreateDeckPage from "./pages/CreateDeckPage";
import CollectionPage from "./pages/CollectionPage";
import LearningPage from "./pages/LearningPage";
import ResultPage from "./pages/ResultPage";
import EditDeckPage from "./pages/EditDeckPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<ExplorePage />} />
          <Route path="/create/:cardboxId" element={<CreateDeckPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/learning/:cardboxId" element={<LearningPage />} />
          <Route path="/results" element={<ResultPage />} />
          <Route path="edit/:cardboxId" element={<EditDeckPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
