import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="w-screen min-h-screen bg-stone-700 p-10">
        <Outlet />
      </div>
    </>
  );
}
