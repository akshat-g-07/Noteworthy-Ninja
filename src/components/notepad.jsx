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
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(false);
  const [notepad, setNotepad] = useState([]);
  const navigate = useNavigate();
  console.log("re-rendered");

  const checkAuth = useCallback(
    async (interactive = false) => {
      try {
        let token;
        if (interactive) {
          token = await getAuthToken();
          console.log("token interactive=>", token);
        } else {
          token = await checkExistingAuthToken();
          console.log("token", token);
        }

        if (token) {
          const userInfo = await getUserInfo(token);
          console.log("userInfo", userInfo);
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
          console.log("isSubscribed", isSubscribed);

          if (!isSubscribed.data) {
            navigate("/payment");
          } else if (!interactive) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.log("this is the error", err.message);
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
    chrome.storage.sync.set({ notepad: tempNotepad }, () => {
      console.log("Storage set:", tempNotepad);
    });
  };

  const handleEditTitle = (indx, newTitle) => {
    let tempNotepad = notepad.map((item) =>
      item.id === indx ? { ...item, title: newTitle } : item
    );
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad }, () => {
      console.log("Storage set:", tempNotepad);
    });
  };

  const handleEditDescription = (indx, newDescdescription) => {
    let tempNotepad = notepad.map((item) =>
      item.id === indx ? { ...item, description: newDescdescription } : item
    );
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad }, () => {
      console.log("Storage set:", tempNotepad);
    });
  };

  const handleDeleteNotepad = (indx) => {
    let tempNotepad = notepad.filter((item) => item.id !== indx);
    setNotepad(tempNotepad);
    chrome.storage.sync.set({ notepad: tempNotepad }, () => {
      console.log("Storage set:", tempNotepad);
    });
  };

  useEffect(() => {
    const fetchNotepad = () => {
      chrome.storage.sync.get("notepad", function (result) {
        console.log("result", result, result.notepad);
        if (result.notepad) setNotepad(result.notepad);
        else {
          console.log("else block executed");
          setNotepad([]);
        }
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

    // const listener = (changes) => {
    //   console.log("changes", changes);
    //   const noteStringChange = changes["noteString"];
    //   console.log("noteStringChange", noteStringChange);
    //   if (noteStringChange) {
    //     console.log("noteStringChange.newValue", noteStringChange.newValue);
    //     updateDefinition(noteStringChange.newValue);
    //   }
    // };

    // console.log(
    //   "inside before useEffect",
    //   chrome.storage,
    //   chrome.storage.session,
    //   chrome.storage.session.onChanged
    // );

    // chrome.storage.onChanged.addListener(listener);
    // console.log("Listener added");
    // chrome.storage.onChanged.addListener((changes, namespace) => {
    //   console.log("changes seconds", changes);
    // });
    // console.log(
    //   "inside after useEffect",
    //   chrome.storage,
    //   chrome.storage.
    //   chrome.storage.onChanged
    // );

    // return () => {
    //   console.log("Removing listener");
    //   chrome.storage.onChanged.removeListener(listener);
    // };
  }, []);

  // function updateDefinition(newWord) {
  //   if (!newWord) return;

  //   setNotepad((prevNotepad) => {
  //     let tempNotepad = [
  //       { id: prevNotepad.length + 1, title: "Untitled", description: newWord },
  //     ];

  //     console.log("tempNotepad before", prevNotepad, tempNotepad);
  //     prevNotepad.forEach((item) => {
  //       tempNotepad.push(item);
  //     });
  //     console.log("tempNotepad after", prevNotepad, tempNotepad);

  //     chrome.storage.sync.set({ notepad: tempNotepad });
  //     return tempNotepad;
  //   });
  // }

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
      navigate("/");
    }
  };

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

async function logout() {
  try {
    const token = await getAuthToken();
    await revokeToken(token);
    // Clear any stored user data in your extension
    // For example, if you're using chrome.storage:
    chrome.storage.local.remove(["userToken", "userInfo"], () => {});
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}
