import { useState } from "react";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircleChevronLeft, Save } from "lucide-react";

export default function Note({
  notepad,
  handleNewNote,
  handleEditTitle,
  handleDeleteNotepad,
  handleEditDescription,
}) {
  const [showNote, setShowNote] = useState();
  const [titleVisible, setTitleVisible] = useState(true);
  const [titleValue, setTitleValue] = useState();
  const [descriptionValue, setDescriptionValue] = useState();
  const [edit, setEdit] = useState(false);

  const handleSelectClick = (itemId) => {
    let tempSelected = notepad.filter((item) => item.id === itemId);
    setShowNote(tempSelected[0]);
    setTitleValue(tempSelected[0].title);
    setDescriptionValue(tempSelected[0].description);
    setTitleVisible(false);
  };

  return (
    <>
      {notepad && notepad.length > 0 ? (
        <>
          <div className="w-full flex-grow border-2 border-black overflow-y-auto">
            {titleVisible ? (
              <div className="w-full h-full px-5">
                {notepad.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`w-full cursor-pointer text-2xl font-semibold px-5 py-2 flex rounded hover:bg-neutral-600 group border-b border-black`}
                      onClick={() => {
                        handleSelectClick(item.id);
                      }}
                    >
                      <div className="truncate w-11/12">{item.title}</div>
                      <div className="hidden w-1/12 group-hover:block">
                        <DeleteIcon
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotepad(item.id);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto p-5 flex flex-col items-end">
                <div className="flex items-end w-full">
                  <button
                    className="px-4 py-2 rounded-md flex items-center shadow-md border border-[#facc15] hover:border-[#facc15]/90 text-[#FDFDF8] bg-[#252120] hover:bg-[#252120]/80 justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    onClick={() => {
                      setTitleVisible(true);
                    }}
                  >
                    <CircleChevronLeft className="mr-2" size={15} />
                    Back
                  </button>
                  <TextField
                    variant="standard"
                    value={titleValue}
                    onChange={(e) => {
                      setTitleValue(e.target.value);
                    }}
                    InputProps={{
                      readOnly: !edit,
                    }}
                    sx={{
                      width: "75%",
                      marginRight: "5px",
                      marginLeft: "5px",
                      "& .MuiInputBase-input": {
                        color: "white",
                      },
                    }}
                  />
                  {edit ? (
                    <SaveIcon
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleEditTitle(showNote.id, titleValue);
                        setEdit(false);
                      }}
                    />
                  ) : (
                    <EditIcon
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setEdit(true);
                      }}
                    />
                  )}
                  <DeleteIcon
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleDeleteNotepad(showNote.id);
                      setTitleVisible(true);
                    }}
                  />
                </div>
                <TextField
                  multiline
                  rows={14}
                  value={descriptionValue}
                  onChange={(e) => {
                    setDescriptionValue(e.target.value);
                  }}
                  sx={{
                    width: "100%",
                    marginTop: "20px",
                    "& .MuiInputBase-input": {
                      color: "#94a3b8",
                    },
                  }}
                />
                <button
                  className="bg-[#facc15] hover:bg-[#facc15]/90 text-black px-4 py-2 rounded-md flex items-center font-medium shadow-md border border-black mt-2"
                  onClick={() => {
                    handleEditDescription(showNote.id, descriptionValue);
                    setTitleVisible(true);
                  }}
                >
                  <Save className="mr-2" size={15} />
                  Save
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className="w-full border-2 border-black flex flex-col items-center justify-center font-semibold text-black bg-[#facc15] hover:bg-[#facc15]/90 text-xl cursor-pointer p-10 rounded-lg"
            onClick={handleNewNote}
          >
            <div className="text-7xl w-full text-center">+</div>
            <div className="text-2xl w-full text-center">
              Start Creating Notes
            </div>
          </div>
        </>
      )}
    </>
  );
}
