import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkExistingAuthToken,
  getAuthToken,
  getUserInfo,
} from "../chromeActions";
import Note from "./note";
import Title from "./title";

export default function Notepad() {
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
                userEmail: userInfo.email,
              }),
            }
          );

          const isSubscribed = await checkSubscription.json();

          if (!isSubscribed.data) {
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
    const fetchNotepad = () => {
      chrome.storage.sync.get("notepad", function (result) {
        if (result.notepad) setNotepad(result.notepad);
        else setNotepad([]);
      });
    };

    fetchNotepad();

    const messageListener = (message) => {
      if (message.type === "UPDATE_DEFINITION") {
        fetchNotepad();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  if (loading) {
    return (
      <>
        <div className="size-full flex items-center justify-center">
          <div className="rounded-full duration-75 size-10 border-x-2 animate-[spin_500ms_linear_infinite] border-x-orange-200" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="size-full overflow-y-auto flex flex-col">
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
