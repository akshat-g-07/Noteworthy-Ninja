import { useEffect, useState } from "react";
import { getAuthToken, getUserInfo } from "./chromeActions";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [noteString, setNoteString] = useState("");

  useEffect(() => {
    chrome.storage.session.get("noteString", ({ noteString }) => {
      updateDefinition(noteString);
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

    setNoteString(newWord);
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
        {noteString && <>{JSON.stringify(noteString)}</>}
        {error && <>{JSON.stringify(error)}</>}
      </div>
    </>
  );
}

export default App;
