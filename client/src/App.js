import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import { AuthorizeUser } from "./helper/middleware";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chats"
          element={
            <AuthorizeUser>
              <Chats />
            </AuthorizeUser>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
