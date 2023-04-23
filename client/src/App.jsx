import { useState, useEffect } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (title) => {
    setCurrentTitle(title);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
      setValue("");
    }
  }, [message, currentTitle]);

  const currentChats = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title))
  );

  return (
    <>
      <div className="app">
        <section className="side-bar">
          <button onClick={createNewChat}>+ New Chat</button>
          <ul className="history">
            {uniqueTitles.map((title) => (
              <li key={title} onClick={() => handleClick(title)}>
                {title}
              </li>
            ))}
          </ul>
          <nav>
            <p>Made by Andy</p>
          </nav>
        </section>
        <section className="main">
          {!currentTitle && <h1>AndyGPT</h1>}
          <ul className="feed">
            {currentChats.map((chatMessage, index) => (
              <li key={index}>
                <p className="role">{chatMessage.role}</p>
                <p>{chatMessage.content}</p>
              </li>
            ))}
          </ul>
          <div className="bottom-section">
            <div className="input-container">
              <input value={value} onChange={(e) => setValue(e.target.value)} />
              <div id="submit" onClick={getMessages}>
                ➢
              </div>
            </div>
            <p className="info">
              Chat GPT Mar 14 Version. Free Research Preview. Our goal is to
              make AI systems more natural and safe to interact with. Your
              feedback will help us improve.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
