import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

/*validate password*/
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}

/* validate reset password */
export async function resetPasswordValidate(values) {
  const errors = passwordVerify({}, values);
  if (values.password !== values.confirm_password) {
    errors.exist = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Passwords aren't matching!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
  return errors;
}

/*Validate Signup*/
export async function signUpValidate(values) {
  const errors = nameVerify({}, values);
  passwordVerify(errors, values);
  confirmPasswordVerify(errors, values);
  emailVerify(errors, values);
  return errors;
}

/*Validate Login*/
export async function loginValidate(values) {
  const errors = emailVerify({}, values);
  loginPasswordVerify(errors, values);
  return errors;
}

/*Validate profile page*/
export async function profileValidate(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/*Validate password*/
function passwordVerify(error = {}, values) {
  // eslint-disable-next-line
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.password) {
    error.password = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Password required!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (values.password.includes(" ")) {
    error.password = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Wrong password!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (values.password.length < 6) {
    error.password = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Password must be atleast 6 characters long!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (!specialChars.test(values.password)) {
    error.password = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Password must have special characters!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
  return error;
}

/*Validate password*/
function loginPasswordVerify(error = {}, values) {
  if (!values.password) {
    error.password = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Password required!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
  return error;
}

/*conform password validation*/
function confirmPasswordVerify(error = {}, values) {
  if (!values.confirmPassword) {
    error.confirmPassword = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Password confirmation required!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (values.password !== values.confirmPassword) {
    error.confirmPassword = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Passwords don't match!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
}

/*Validate name*/
function nameVerify(error = {}, values) {
  // eslint-disable-next-line
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.name) {
    error.name = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Name required!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (specialChars.test(values.name)) {
    error.name = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>name must not contain special characters!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
  return error;
}

/*validate email*/
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Email required!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  } else if (
    values.email.includes(" ") ||
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    error.email = toast(
      (t) => (
        <span className="flex items-center gap-1">
          <b>Invalid email address!</b>
          <button onClick={() => toast.dismiss(t.id)}>
            <AiFillCloseCircle color="red" size={23} />
          </button>
        </span>
      ),
      {
        duration: 3000,
      }
    );
  }
  return error;
}
