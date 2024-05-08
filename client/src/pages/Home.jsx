import React from "react";
import styles from "../styles/Home.module.css";
import { useDispatch, useSelector } from "react-redux";
import { homeActions } from "../store/home-slice";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import { Toaster } from "react-hot-toast";

const Home = () => {
  const showLoginPage = useSelector((state) => state.home.showLoginPage);
  const dispatch = useDispatch();
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(homeActions.login());
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    dispatch(homeActions.signUp());
  };

  return (
    <div className="container w-[90%] lg:w-[45%] md:w-[60%] sm:w-[80%] mt-3">
      <Toaster position="top-right" reverseOrder={false}></Toaster>
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${styles.glass} bg-white w-full p-5 flex  gap-2 flex-col items-center`}
        >
          <div className="flex gap-1 justify-center items-center bg-primary py-1.5 px-6 rounded-xl font-Poppins cursor-pointer w-fit">
            <img
              className="w-10 select-none"
              alt="ChatLub Logo"
              src="/assets/logo/ChatLub_Logo.png"
              draggable={false}
            />
            <h1 className="select-none text-3xl text-white font-bold">
              ChatLive
            </h1>
          </div>
          <div className="w-full rounded-lg h-max flex flex-col">
            <div className="flex w-full items-center place-content-around bg-white rounded-full p-1 select-none">
              <span
                onClick={handleLogin}
                className={`py-2 text-center w-[50%] rounded-full cursor-pointer ${
                  showLoginPage ? "bg-primary/90 text-white" : "bg-white"
                } transition-all duration-200 text-xl font-semibold`}
              >
                Login
              </span>
              <span
                onClick={handleSignUp}
                className={`py-2 text-center w-[50%] rounded-full cursor-pointer ${
                  showLoginPage ? "bg-white" : "bg-primary/90 text-white"
                } transition-all duration-200 text-xl font-semibold`}
              >
                Sign up
              </span>
            </div>
            {showLoginPage ? <Login /> : <SignUp />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
