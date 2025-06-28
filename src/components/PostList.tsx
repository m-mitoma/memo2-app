import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { Auth, User } from "firebase/auth";
import { db } from "../firebase";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | null;
}

interface PostListProps {
  auth: Auth;
}

const PostList = ({ auth }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    //ログインしているユーザーの投稿だけをリアルタイムで画面に表示する
    if (currentUserId === null) {
      setPosts([]);
      setError(null);
      setLoading(false);
      return;
    }

    //ログイン中のユーザーが投稿した記事を新しい順に並べたもの
    const q = query(
      collection(db, "posts"),
      where("userId", "==", currentUserId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeFirestore = onSnapshot(
      q,
      (querySnapshot) => {
        const postsData: Post[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          postsData.push({
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt:
              data.createdAt && typeof data.createdAt.seconds === "number"
                ? {
                    seconds: data.createdAt.seconds,
                    nanoseconds: data.createdAt.nanoseconds,
                  }
                : null,
          });
        });
        setPosts(postsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("投稿の取得エラー: ", err);
        setError("投稿の読み込み中にエラーが発生しました。");
        setLoading(false);
      }
    );

    return () => unsubscribeFirestore();
  }, [currentUserId]);

  if (loading) {
    return <p>投稿を読み込み中...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>投稿一覧</h2>
      {posts.length === 0 && currentUserId !== null ? (
        <p>まだ投稿がありません。</p>
      ) : posts.length === 0 && currentUserId === null ? (
        <p>投稿を表示するにはログインしてください。</p>
      ) : (
        <ul className="memoList">
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p style={{ fontSize: "0.8em", color: "#666" }}>
                投稿日時:{" "}
                {post.createdAt
                  ? new Date(post.createdAt.seconds * 1000).toLocaleString()
                  : "日付不明"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
