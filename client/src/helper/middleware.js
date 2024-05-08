import { Navigate } from "react-router-dom";

export const AuthorizeUser = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userLoginInfo"));
  if (!userInfo) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};
