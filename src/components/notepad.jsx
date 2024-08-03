import { useState } from "react";

export default function Notepad({ notepad }) {
  const [showNote, setShowNote] = useState(null);
  const handleSelectClick = (itemId) => {
    let tempSelected = notepad.filter((item) => item.id === itemId);
    setShowNote(tempSelected[0].description);
  };
  return (
    <>
      <p>! ---- Notepad Component ---- !</p>
      <div className="w-full border-2 border-black">
        <div className="w-1/6">
          {notepad.map((item) => {
            return (
              <div
                key={item.id}
                className="w-full h-10"
                onClick={() => {
                  handleSelectClick(item.id);
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
        <div className="w-5/6">{showNote}</div>
      </div>
    </>
  );
}
