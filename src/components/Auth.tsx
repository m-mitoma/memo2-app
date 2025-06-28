import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";

interface AuthProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
}

const Auth = ({ onLogin, onLogout }: AuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        onLogin(user);
      } else {
        onLogout();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [onLogin, onLogout]);

  const handleRegister = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      console.log("ユーザー登録が完了しました！");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
        console.error("登録エラー:", err);
      } else if (err instanceof Error) {
        setError(err.message);
        console.error("登録エラー:", err);
      } else {
        setError("不明なエラーが発生しました。");
        console.error("登録エラー:", err);
      }
    }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      console.log("ログインしました！");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
        console.error("ログインエラー:", err);
      } else if (err instanceof Error) {
        setError(err.message);
        console.error("ログインエラー:", err);
      } else {
        setError("不明なエラーが発生しました。");
        console.error("ログインエラー:", err);
      }
    }
  };

  const handleLogout = async () => {
    setError(null);
    try {
      await signOut(auth);
      console.log("ログアウトしました。");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        setError(err.message);
        console.error("ログアウトエラー:", err);
      } else if (err instanceof Error) {
        setError(err.message);
        console.error("ログアウトエラー:", err);
      } else {
        setError("不明なエラーが発生しました。");
        console.error("ログアウトエラー:", err);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          marginBottom: "20px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        認証状態を確認中...
      </div>
    );
  }

  return (
    <div className="loginForm">
      {currentUser ? (
        <div>
          <h3>こんにちは、{currentUser.email}さん！</h3>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div>
          <h3>ログイン / 新規登録</h3>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "8px", margin: "5px 0" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="loginButton">
            <button
              onClick={handleLogin}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              ログイン
            </button>
            <button
              onClick={handleRegister}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              新規登録
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
