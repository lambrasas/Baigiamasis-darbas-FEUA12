import React, { useState } from "react";
import InputField from "../components/InputField";
import { useUser } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CreateThreadPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage("You must be logged in to post a new thread.");
      return;
    }

    const threadData = {
      title,
      content,
      userId: user._id,
    };
    try {
      const response = await fetch("http://localhost:3000/add/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(threadData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Thread posted successfully: ", responseData);
        setTitle("");
        setContent("");
        setMessage("Thread posted successfully!");
        navigate("/threads");
      } else {
        const error = await response.json();
        console.log(`Failed to post thread: `, error.message);
        setMessage(`Failed to post thread: ${error.message}`);
      }
    } catch (error) {
      console.error("Failed to post thread:", error);
      setMessage("Failed to post thread due to server error.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => navigate("/threads")}>Back to threads</button>
      </div>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onSubmit={handleSubmit}
      >
        <InputField
          label="Title"
          type="text"
          value={title}
          style={{ width: "75%", maxWidth: "1000px" }}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputField
          label="Content"
          type="text"
          value={content}
          inputType="textarea"
          rows={10}
          maxLength={500}
          style={{ width: "75%", maxWidth: "1000px" }}
          onChange={(e) => setContent(e.target.value)}
        />
        <div>{`${content.length} / 500 characters`}</div>
        <button type="submit">Post</button>
        {message && (
          <div style={{ marginTop: "10px", color: "red" }}>{message}</div>
        )}
      </form>
    </>
  );
};

export default CreateThreadPage;
