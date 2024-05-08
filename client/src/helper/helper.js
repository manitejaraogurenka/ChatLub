import axios from "axios";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/chat-slice";

/*SignUp user function*/
export async function signUpUser(credentials) {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { name, email, password, profile } = credentials;
    const { data } = await axios.post(
      "/api/user",
      {
        name: name,
        email: email,
        password: password,
        profile: profile,
      },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An error occurred. Please try again later.");
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (email) {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      const { profile } = await axios.get(`/api/user?email=${email}`, config);
      const userData = { ...data, profile };
      localStorage.setItem("userLoginInfo", JSON.stringify(userData));
      return userData;
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An error occurred. Please try again later.");
    }
    throw error;
  }
}

export const useProfilePicture = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const dispatch = useDispatch();

  const fetchProfilePicture = async (email) => {
    try {
      if (!email) {
        setProfilePicture(null);
        return;
      }

      // Use the email as is
      const response = await axios.get(`/api/user?email=${email}`);
      setProfilePicture(response.data.profilePicture);
      dispatch(chatActions.setProfilePicture(response.data.profilePicture));
    } catch (error) {
      setProfilePicture(null);
    }
  };

  const debouncedFetchProfilePicture = useRef(
    debounce(fetchProfilePicture, 700)
  ).current;

  const handleEmailChange = async (formik, email) => {
    if (!formik) {
      return;
    }

    formik.setFieldValue("email", email); // Update the formik field value

    // Fetch profile picture if a complete email address is entered
    if (email.includes("@")) {
      await debouncedFetchProfilePicture(email);
    } else {
      setProfilePicture(null);
    }
  };

  return { profilePicture, handleEmailChange };
};

export async function editUser({ user, field, value }) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      "/api/user/edituser",
      { userId: user.id, field, value },
      config
    );
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An error occurred. Please try again later.");
    }
    throw error;
  }
}
