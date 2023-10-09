import { Button, Label, TextInput } from "flowbite-react";
import { formTheme, buttonTheme } from "../../components/FlowBiteStyles/Styles";
import { HiMail } from "react-icons/hi";
import { TfiKey } from "react-icons/tfi";
import { useCallback, useContext, useState } from "react";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

const forgotPassword = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      await props.supabase.auth.resetPasswordForEmail(props.email, {
        redirectTo: `${process.env.REACT_APP_FRONTEND_URL}/resetpassword`,
      });
      resolve("success");
      toast("Reset link sent to your email");
    } catch (e) {
      reject(e);
      toast("Error sending reset link");
    }
  });
};

const resetPassword = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      await props.supabase.auth.updateUser({ password: props.password });
      resolve("success");
      toast("Password reset successfully");
    } catch (e) {
      reject(e);
      toast("Error resetting password");
    }
  });
};

const ForgotPassWord = (props) => {
  const { supabase } = useContext(AuthContext);
  const handleForgotPassword = useCallback(
    (e) => {
      e.preventDefault();
      const emailValue = e.target[0].value;
      console.log(emailValue);
      forgotPassword({ email: emailValue, supabase })
        .then((data) => {
          console.log("sucess");
        })
        .catch((e) => {
          console.error(e);
        });
    },
    [supabase]
  );
  return (
    <>
      <div className=" text-6xl text-purple-800 drop-shadow-xl font-extrabold mt-32 text-center">
        Smart Pact
      </div>
      <form
        className="flex max-w-md flex-col gap-4 mt-14 mx-auto  bg-white shadow-2xl shadow-gray-300 px-10 py-10 rounded-lg overflow-hidden"
        onSubmit={handleForgotPassword}
      >
        <div>
          <div className="mb-2 block">
            <Label
              theme={formTheme.label}
              htmlFor="sb-email"
              value="Email Address"
            />
          </div>
          <TextInput
            id="sb-email"
            icon={HiMail}
            theme={formTheme.textInput}
            size="md"
            required
            type="email"
          />
        </div>
        <Button theme={buttonTheme} color="purple" size="md" type="submit">
          Send Reset Link
        </Button>
      </form>
    </>
  );
};

const FormError = (props) => {
  return (
    <div className="flex items-center ">
      <div
        className={`bg-${props.color}-100 border border-${props.color}-400 text-${props.color}-700 mt-10 mx-auto px-4 py-3 rounded relative`}
      >
        <span className="block sm:inline">{props.message}</span>
      </div>
    </div>
  );
};

const ResetPassWord = (props) => {
  const [formError, setFormError] = useState(null);
  const { supabase } = useContext(AuthContext);
  const handleResetPassword = useCallback(
    (e) => {
      e.preventDefault();
      const passwordValue = e.target[0].value;
      console.log(passwordValue);
      resetPassword({ password: passwordValue, supabase })
        .then((data) => {
          if (e.target[0].value !== e.target[1].value) {
            throw new Error("Passwords Don't match");
          }
          setFormError({
            message: "Password reset successfully",
            color: "green",
          });
        })
        .catch((error) => {
          console.error(error);
          setFormError({ message: error.message, color: "red" });
        });
    },
    [supabase]
  );
  return (
    <>
      <>
        <div className=" text-6xl text-purple-800 drop-shadow-xl font-extrabold mt-32 text-center">
          Smart Pact
        </div>
        <form
          className="flex max-w-md flex-col gap-4 mt-14 mx-auto  bg-white shadow-2xl shadow-gray-300 px-10 py-10 rounded-lg overflow-hidden"
          onSubmit={handleResetPassword}
        >
          <div>
            <div className="mb-2 block">
              <Label
                theme={formTheme.label}
                htmlFor="new-password"
                value="New Password"
              />
            </div>
            <TextInput
              id="new-password"
              icon={TfiKey}
              theme={formTheme.textInput}
              required
              type="password"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                theme={formTheme.label}
                htmlFor="repeat-password"
                value="Confirm Password"
              />
            </div>
            <TextInput
              id="repeat-password"
              icon={TfiKey}
              theme={formTheme.textInput}
              required
              type="password"
            />
          </div>
          <Button theme={buttonTheme} color="purple" size="md" type="submit">
            Reset
          </Button>
        </form>
      </>
      {formError && (
        <FormError message={formError.message} color={formError.color} />
      )}
    </>
  );
};

export { ForgotPassWord, ResetPassWord };
