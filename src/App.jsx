import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getUserInfo } from "./chromeActions";
import Home from "./components/home";

export default function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getAuthToken();
        const userInfo = await getUserInfo(token);
        navigate("/payment", { state: { key: userInfo.given_name } });
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <div className="w-screen min-h-screen bg-stone-700 flex  items-center justify-center">
          <div className="rounded-full duration-75 size-10 border-x-2 animate-[spin_500ms_linear_infinite] border-x-orange-200" />
        </div>
      </>
    );
  }

  return (
    <>
      <Home />
    </>
  );
}
