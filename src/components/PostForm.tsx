import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

interface FormData {
  title: string;
  content: string;
}

const PostForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSubmissionError(null);
    try {
      const user = auth.currentUser;
      if (!user) {
        setSubmissionError("投稿するにはログインが必要です。");
        return;
      }
      await addDoc(collection(db, "posts"), {
        title: data.title,
        content: data.content,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      console.log("投稿が完了しました！");
      reset();
    } catch (e: unknown) {
      if (e instanceof Error && "code" in e && typeof e.code === "string") {
        if (
          e.code === "permission-denied" ||
          e.code === "missing-or-insufficient-permissions"
        ) {
          // Firebaseのエラーハンドリング
          console.error("An unexpected error occurred:", e);
        }
      } else {
        // 予期しないエラーの場合の処理
        console.error("An unexpected error occurred:", e);
      }
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>新しい投稿</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">タイトル:</label>
          <input
            id="title"
            {...register("title", { required: "タイトルは必須です" })}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          />
          {errors.title && (
            <p style={{ color: "red" }}>{errors.title.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="content">内容:</label>
          <textarea
            id="content"
            {...register("content", { required: "内容は必須です" })}
            rows={5}
            style={{ width: "100%", padding: "8px", margin: "5px 0" }}
          ></textarea>
          {errors.content && (
            <p style={{ color: "red" }}>{errors.content.message}</p>
          )}
        </div>
        {submissionError && (
          <p style={{ color: "red", marginTop: "10px" }}>{submissionError}</p>
        )}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          投稿する
        </button>
      </form>
    </div>
  );
};
export default PostForm;
