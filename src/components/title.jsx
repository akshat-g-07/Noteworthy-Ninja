export default function Title({ userName, userPicture, handleNewNote }) {
  return (
    <>
      <div className="w-full border-4 p-2 border-black flex items-center mb-4">
        <div
          className="w-9 rounded-full overflow-hidden aspect-square"
          style={{
            backgroundImage: `url(${userPicture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <p className="text-4xl font-bold ml-3 flex-grow">Hello, {userName}!</p>
        <div
          className="text-4xl font-bold cursor-pointer rounded-full bg-black text-white px-3 pb-2"
          onClick={handleNewNote}
        >
          +
        </div>
      </div>
    </>
  );
}
