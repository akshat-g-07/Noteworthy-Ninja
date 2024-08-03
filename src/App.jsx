import { useEffect, useState } from "react";
import { getAuthToken, getUserInfo } from "./chromeActions";
import Notepad from "./components/notepad";
import TitleBar from "./components/title-bar";

function App() {
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(null);
  const [notepad, setNotepad] = useState([]);

  const handleNewNote = () => {
    let tempNotepad = [
      { id: notepad.length + 1, title: "Untitled", description: "" },
    ];

    notepad.forEach((item) => tempNotepad.push(item));

    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad });
  };

  const handleEditTitle = (indx, newTitle) => {
    let tempNotepad = notepad.map((item) =>
      item.id === indx ? { ...item, title: newTitle } : item
    );
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad });
  };
  const handleEditDescription = (indx, newDescdescription) => {
    let tempNotepad = notepad.map((item) =>
      item.id === indx ? { ...item, description: newDescdescription } : item
    );
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad });
  };

  const handleDeleteNotepad = (indx) => {
    let tempNotepad = notepad.filter((item) => item.id !== indx);
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad });
  };

  useEffect(() => {
    chrome.storage.sync.get("notepad", function (result) {
      console.log("result", result, result.notepad);
      if (result.notepad) setNotepad(result.notepad);
      else {
        setNotepad([]);
      }
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

    let tempNotepad = [
      { id: notepad.length + 1, title: "Untitled", description: newWord },
    ];

    notepad.forEach((item) => tempNotepad.push(item));

    console.log(" updateDefinition tempNotepad", tempNotepad);
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad });
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
        {userInfo && (
          <>
            <TitleBar
              userName={userInfo.given_name}
              handleNewNote={handleNewNote}
            />
            <Notepad
              notepad={notepad}
              handleDeleteNotepad={handleDeleteNotepad}
              handleEditTitle={handleEditTitle}
              handleEditDescription={handleEditDescription}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;
