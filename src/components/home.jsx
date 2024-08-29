import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuthToken,
  getUserInfo,
  checkExistingAuthToken,
} from "../chromeActions";
import { ArrowDownLeft } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
          navigate("/payment", {
            state: { key: { user: userInfo } },
          });
        } else if (!interactive) {
          setLoading(false);
        }
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    },
    [navigate]
  );

  // useEffect(() => {
  //   checkAuth(false); 
  // }, [checkAuth]);

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
      <div className="size-full">
        {/* Header */}
        <div className="max-w-xl mx-auto h-fit mt-10 lg:mt-5">
          <div className="w-full h-10 md:h-12 lg:h-14 items-center flex justify-center">
            <img src="/logo.jpeg" className="w-auto h-full mr-2" />
            <p className="w-fit text-white tracking-wider text-3xl md:text-4xl lg:text-5xl font-bold md:font-extrabold lg:font-extrabold">
              Noteworthy Ninja
            </p>
          </div>

          {/* Descrpition */}
          <p className="w-full my-5 text-center text-white/65 text-lg md:text-xl lg:text-2xl font-semibold md:font-bold lg:font-bold">
            Take notes anywhere, sync everywhere—your notes are always in reach.
          </p>

          {/* Get Started Button */}
          <button
            className="bg-yellow-500 size-fit mx-auto flex my-10 tracking-wider text-2xl md:text-3xl lg:text-4xl font-bold md:font-extrabold lg:font-extrabold p-3 rounded items-center cursor-pointer shadow"
            onClick={() => {
              checkAuth(true); // Call checkAuth with interactive=true when button is clicked
              navigate("/payment");
            }}
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Tutorial */}
          <div className="bg-black size-80 lg:size-64 mx-auto"></div>

          {/* Developer */}
          <div className="w-full text-white text-xl font-bold flex flex-col lg:flex-row justify-center items-center my-5">
            <p>Developed by</p>
            <p className="opacity-0 hidden lg:block">a</p>
            <p
              className="flex hover:underline cursor-pointer mt-2 lg:mt-0"
              onClick={() => {
                window.open("https://akshat-garg.com", "_blank");
              }}
            >
              Akshat Garg
              <ArrowDownLeft className="size-3 rotate-180" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
