import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { LoginSection, SignupSection } from "./Section";


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

const LoginPage = (props) => {
  const { supabase } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated
    if (!supabase) {
      throw new Error("LoginPage : ", "Supabase client not initialized")();
    }

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (data?.session === null || data?.session === undefined || error) {
          setAuthChecking(false);
        } else {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("LoginPage : ", error);
        setAuthChecking(false);
      });
  }, [supabase, navigate]);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      supabase.auth
        .signInWithPassword({
          email: e.target[0].value,
          password: e.target[1].value,
        })
        .then((data) => {
          if (data.error) throw new Error(data.error.message);

          // TODO : Show this as a success message, instead of
          setFormError({ message: "Success!", color: "green" });
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("LoginPage : ", error);
          setFormError({ message: error.message, color: "red" });
        });
    },
    [supabase, navigate]
  );

  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();

      supabase.auth
        .signUp({
          email: e.target[3].value,
          password: e.target[4].value,
          options: {
            data: {
              first_name: e.target[1].value,
              last_name: e.target[2].value,
            },
          },
        })
        .then((data) => {
          if (data.error) throw new Error(data.error.message);
          if(e.target[0].value !== e.target[1].value){
            throw Error("Passwords Don't match")
        }

          // TODO : Show this as a success message, instead of
          setFormError({
            message: "Check your email for confirmation!",
            color: "green",
          });
        })
        .catch((error) => {
          console.error("LoginPage : ", error);
          setFormError({ message: error.message, color: "red" });
        });
    },
    [supabase]
  );

  return (
    <>
      {authChecking ? (
        <div className="w-100  text-center justify-center absolute top-1/2 left-1/2">
          <Spinner
            size="xl"
            className="fill-[#4d4dc7]"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
        <>
          {props.login ? (
            <LoginSection handleLogin={handleLogin} />
          ) : (
            <SignupSection handleSignup={handleSignup} />
          )}
        </>
      )}
      {formError && (
        <FormError message={formError.message} color={formError.color} />
      )}
    </>
  );
};

export default LoginPage;
