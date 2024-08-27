import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkExistingAuthToken,
  getAuthToken,
  getUserInfo,
  revokeToken,
} from "../chromeActions";
import Note from "./note";
import Title from "./title";

export default function Notepad() {
  console.log("notepad");
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [notepad, setNotepad] = useState([]);
  const navigate = useNavigate();

  const checkAuth = useCallback(
    async (interactive = false) => {
      try {
        let token;
        if (interactive) {
          token = await getAuthToken();
        } else {
          token = await checkExistingAuthToken();
        }

        if (token) {
          const userInfo = await getUserInfo(token);
          if (!userInfo) navigate("/");

          setUserInfo(userInfo);

          const checkSubscription = await fetch(
            import.meta.env.VITE_PYTHON_SERVICE + "/check_subscription",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userEmail: user.email,
              }),
            }
          );

          const isSubscribed = await checkSubscription.json();

          if (!isSubscribed) {
            navigate("/payment");
          } else if (!interactive) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    checkAuth(false);
  }, [checkAuth]);

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

  if (loading) {
    return (
      <>
        <div className="size-full flex items-center justify-center">
          <div className="rounded-full duration-75 size-10 border-x-2 animate-[spin_500ms_linear_infinite] border-x-orange-200" />
        </div>
      </>
    );
  }

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      console.log("Logged out successfully");
      // Update your app state or redirect the user
    } else {
      console.log("Logout failed");
    }
  };

  return (
    <>
      <div className="size-full">
        <button onClick={handleLogout}>Logout</button>

        {userInfo && (
          <>
            <Title
              userName={userInfo.given_name}
              userPicture={userInfo.picture}
              handleNewNote={handleNewNote}
            />
            <Note
              notepad={notepad}
              handleNewNote={handleNewNote}
              handleEditTitle={handleEditTitle}
              handleDeleteNotepad={handleDeleteNotepad}
              handleEditDescription={handleEditDescription}
            />
          </>
        )}
      </div>
    </>
  );
}

async function logout() {
  try {
    const token = await getAuthToken();
    await revokeToken(token);
    // Clear any stored user data in your extension
    // For example, if you're using chrome.storage:
    chrome.storage.local.remove(["userToken", "userInfo"], () => {
      console.log("User data cleared");
    });
    navigate("/");
    // You might also want to update your UI to reflect the logged out state
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}
