import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useUser } from "../Contexts/UserContext";
import styles from "./ViewSingleThreadComponent.module.scss";

const ViewSingleThreadComponent = () => {
  const { threadId } = useParams();
  const { user } = useUser();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!threadId) {
      console.error("Thread ID is undefined");
      setError("Thread ID is undefined");
      setLoading(false);
      return;
    }
    const fetchThread = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/get/thread/${threadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the thread");
        }
        const data = await response.json();
        setThread(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId]);

  const handleLikeDislike = async (like = true) => {
    if (!user) {
      alert("You must be logged in to like or dislike a thread.");
      return;
    }
    try {
      const url = `http://localhost:3000/${like ? "like" : "dislike"}-thread/${
        thread._id
      }`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${like ? "like" : "dislike"} the thread on the server.`
        );
      }
      const updatedThreadData = await response.json();

      setThread((prevThread) => ({
        ...prevThread,
        likes: updatedThreadData.likes,
        dislikes: updatedThreadData.dislikes,
      }));
    } catch (error) {
      console.error(
        `Failed to ${like ? "like" : "dislike"} the thread:`,
        error
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!thread) return <p>No thread found</p>;

  return (
    <div className={styles.threadDetails}>
      <h1>{thread.title}</h1>
      <p>Posted by: {thread.userId.name}</p>
      <p>Date: {format(new Date(thread.createdDate), "dd/MM/yyyy")}</p>
      <div>{thread.content}</div>
      <div className={styles.actions}>
        <button onClick={() => handleLikeDislike(true)}>
          👍 Like ({thread.likes.length})
        </button>
        <button onClick={() => handleLikeDislike(false)}>
          👎 Dislike ({thread.dislikes.length})
        </button>
      </div>
    </div>
  );
};

export default ViewSingleThreadComponent;
