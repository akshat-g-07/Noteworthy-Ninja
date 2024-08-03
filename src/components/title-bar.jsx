import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function TitleBar({ userName, handleNewNote }) {
  return (
    <>
      <div className="w-full border-4 p-2 border-black flex items-end mb-4">
        <div className="size-7 rounded-full bg-blue-500"></div>
        <p className="text-xl font-bold ml-3 w-10/12">Hello, {userName}</p>
        <AddCircleIcon
          sx={{
            cursor: "pointer",
          }}
          onClick={handleNewNote}
        />
      </div>
    </>
  );
}
