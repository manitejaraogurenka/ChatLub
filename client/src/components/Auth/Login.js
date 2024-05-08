import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import styles from "../../styles/Home.module.css";
import { AiFillEye } from "react-icons/ai";
import { homeActions } from "../../store/home-slice";
import { AiFillEyeInvisible } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import profileCat from "../../statics/profileCat.gif";
import { useSelector, useDispatch } from "react-redux";
import { loginValidate } from "../../helper/validate";
import { loginUser } from "../../helper/helper";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useProfilePicture } from "../../helper/helper";
import { chatActions } from "../../store/chat-slice";

const Login = () => {
  const { profilePicture, handleEmailChange } = useProfilePicture();
  const isVisible = useSelector((state) => state.home.isVisible);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
    if (userInfo) {
      dispatch(chatActions.setUser(userInfo));
      navigate("/chats");
    }
  }, [dispatch, navigate]);

  const handleShow = (e) => {
    e.preventDefault();
    dispatch(homeActions.showPassword());
  };

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      let loginPromise = loginUser(values);

      loginPromise
        .then((result) => {
          if (result) {
            toast.success("login successful!");
            setTimeout(() => {
              navigate("/chats");
              setLoading(false);
            }, 1000);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div className="flex flex-col justify-center">
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col mt-1.5 gap-5">
            <div className="flex flex-col">
              <span className="mx-auto mt-4 select-none border-white border-4 rounded-full shadow-xl">
                <img
                  src={profilePicture ? profilePicture : profileCat}
                  alt="Profile"
                  className="border-4 border-white w-[95px] h-[95px] rounded-full m-0 p-0 select-none hover:border-gray-200"
                  draggable={false}
                />
              </span>
              <label htmlFor="email" className={`${styles.label} select-none`}>
                Email
              </label>
              <input
                {...formik.getFieldProps("email")}
                name="email"
                placeholder="Enter your email"
                type="text"
                className={styles.textbox}
                onChange={(e) => handleEmailChange(formik, e.target.value)}
              />
            </div>
            <div className="flex flex-col relative">
              <label
                htmlFor="password"
                className={`${styles.label} select-none`}
              >
                Password
              </label>
              <input
                {...formik.getFieldProps("password")}
                name="password"
                placeholder="Enter password"
                type={`${isVisible ? "text" : "password"}`}
                className={styles.textbox}
              />
              <span
                className="absolute right-0 inset-y-0 flex items-center pr-4 pt-8"
                onClick={handleShow}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isVisible ? (
                  <AiFillEye
                    size={28}
                    color="#24CEED"
                    className=" cursor-pointer"
                  />
                ) : (
                  <AiFillEyeInvisible
                    size={28}
                    color="#24CEED"
                    className=" cursor-pointer"
                  />
                )}
              </span>
            </div>

            <button
              type="submit"
              className="py-2 bg-primary rounded-xl mt-2 border-white border-2 text-white font-bold hover:shadow-lg select-none outline-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1">
                  <BiLoaderCircle
                    size={25}
                    style={{
                      color: "#ffffff",
                    }}
                    className={styles.spin}
                  />
                  Loading...
                </span>
              ) : (
                `Login`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
