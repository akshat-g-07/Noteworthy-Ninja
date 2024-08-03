import { useState } from "react";
import { getAuthToken, getUserInfo } from "./chromeActions";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

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
      </div>
    </>
  );
}

export default App;
