import { useEffect, useState } from "react";
import { getAuthToken, getUserInfo } from "./chromeActions";
import Notepad from "./components/notepad";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [notepad, setNotepad] = useState([]);

  useEffect(() => {
    chrome.storage.session.get("noteString", ({ noteString }) => {
      updateDefinition(noteString);
    });

    chrome.storage.sync.get("notepad", function (result) {
      setNotepad(result.notepad);

      console.log(result.notepad);
    });

    const listener = (changes) => {
      const noteStringChange = changes["noteString"];
      if (noteStringChange) {
        updateDefinition(noteStringChange.newValue);
      }
    };

    chrome.storage.session.onChanged.addListener(listener);

    return () => {
      chrome.storage.session.onChanged.removeListener(listener);
    };
  }, []);

  function updateDefinition(newWord) {
    if (!newWord) return;

    setNotepad((prev) => [
      { id: prev.length + 1, title: "Untitled", description: newWord },
      ...prev,
    ]);

    chrome.storage.sync.set({
      notepad: [
        { id: prev.length + 1, title: "Untitled", description: newWord },
        ...notepad,
      ],
    });
  }

  const authenticate = async () => {
    try {
      const token = await getAuthToken();
      const info = await getUserInfo(token);
      setUserInfo(info);
      setError(null);
    } catch (error) {
      setError(error.message);
      setUserInfo(null);
    }
  };

  return (
    <>
      <div className="h-screen w-screen bg-neutral-500 rounded p-4">
        <button onClick={authenticate}>Authenticate</button>
        {userInfo && <>{JSON.stringify(userInfo)}</>}

        {error && <>{JSON.stringify(error)}</>}
        <Notepad notepad={notepad} />
      </div>
    </>
  );
}

export default App;
