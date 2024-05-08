import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import styles from "../../styles/Home.module.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiSolidMessageSquareEdit, BiLoaderCircle } from "react-icons/bi";
import profilePic from "../../statics/profilePic.jpg";
import { homeActions } from "../../store/home-slice";
import { useSelector, useDispatch } from "react-redux";
import { resizeImage } from "../../helper/convert";
import { signUpValidate } from "../../helper/validate";
import { signUpUser } from "../../helper/helper";

const SignUp = () => {
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(homeActions.login());
  };

  const { isVisible, isVisible2 } = useSelector((state) => state.home);

  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

  const handleShow = (e) => {
    e.preventDefault();
    dispatch(homeActions.showPassword());
  };

  const handleConfirmShow = (e) => {
    e.preventDefault();
    dispatch(homeActions.showConfirmPassword());
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: signUpValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setLoading(true);
      values = Object.assign(values, { profile: profile || "" });
      let signUpPromise = signUpUser(values);

      signUpPromise
        .then((result) => {
          if (result) {
            toast.success("Sign up successful!");
            setTimeout(() => {
              handleLogin();
              setLoading(false);
            }, 2000);
          } else {
            setLoading(false);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    },
  });

  const onUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size here
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      const uri = await resizeImage(file);
      setProfile(uri);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center">
      <div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col mt-1.5 gap-1.5">
            <div className="flex justify-center mt-2 p-0 relative">
              <label htmlFor="profile">
                <span className="absolute ml-[4.5rem] mt-14 bg-white rounded-t-xl rounded-br-xl">
                  <BiSolidMessageSquareEdit
                    color="#1f1f1f"
                    size={30}
                    className="cursor-pointer"
                  />
                </span>
                <img
                  src={profile || profilePic}
                  className="border-4 border-white w-[95px] h-[95px] rounded-full shadow-xl m-0 p-0 select-none cursor-pointer hover:border-gray-200"
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
                accept="image/jpeg,image/jpg,image/png"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-black text-base font-semibold select-none pb-1 pl-1 mt-0"
              >
                Name
              </label>
              <input
                {...formik.getFieldProps("name")}
                name="name"
                placeholder="Enter your name"
                type="text"
                className={styles.textbox}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className={`${styles.label} select-none`}>
                Email
              </label>
              <input
                {...formik.getFieldProps("email")}
                name="email"
                placeholder="Enter your email"
                type="text"
                className={styles.textbox}
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
                placeholder="Set password"
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
                    className="cursor-pointer"
                  />
                ) : (
                  <AiFillEyeInvisible
                    size={28}
                    color="#24CEED"
                    className="cursor-pointer"
                  />
                )}
              </span>
            </div>
            <div className="flex flex-col relative">
              <label
                htmlFor="confirmPassword"
                className={`${styles.label} select-none`}
              >
                Confirm password
              </label>
              <input
                {...formik.getFieldProps("confirmPassword")}
                name="confirmPassword"
                placeholder="Confirm password"
                type={`${isVisible2 ? "text" : "password"}`}
                className={styles.textbox}
              />
              <span
                className="absolute right-0 inset-y-0 flex items-center pr-4 pt-8"
                onClick={handleConfirmShow}
                onMouseDown={(e) => e.preventDefault()}
              >
                {isVisible2 ? (
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
              className=" py-2 bg-primary rounded-xl mt-1.5 border-white border-2 text-white font-bold hover:shadow-lg select-none outline-none"
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
                `Sign up`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
