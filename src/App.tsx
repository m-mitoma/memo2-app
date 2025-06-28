import { useState } from "react";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import Auth from "./components/Auth";
import type { User } from "firebase/auth";
import "./App.css";
import { auth } from "./firebase";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setIsLoggedIn(true);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="App">
      <h1>メモアプリ</h1>
      <h2>firebase版</h2>
      <Auth onLogin={handleLogin} onLogout={handleLogout} />
      {isLoggedIn ? (
        <PostForm />
      ) : (
        <div>
          <p>投稿するにはログインしてください。</p>
        </div>
      )}
      {user && <PostList auth={auth} />}
    </div>
  );
}

export default App;
