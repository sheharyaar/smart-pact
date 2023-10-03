import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { LoginSection, SignupSection } from "./Section";

const FormError = (props) => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
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
          console.log("LoginPage : ", data);
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
          setFormError("Success!");
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("LoginPage : ", error);
          setFormError(error.message);
        });
    },
    [supabase]
  );

  const handleSignup = useCallback(
    (e) => {
      e.preventDefault();

      supabase.auth
        .signUp({
          email: e.target[2].value,
          password: e.target[3].value,
          options: {
            data: {
              first_name: e.target[0].value,
              last_name: e.target[1].value,
            },
          },
        })
        .then((data) => {
          if (data.error) throw new Error(data.error.message);

          // TODO : Show this as a success message, instead of
          setFormError("Check your email for confirmation!");
        })
        .catch((error) => {
          console.error("LoginPage : ", error);
          setFormError(error.message);
        });
    },
    [supabase]
  );

  return (
    <>
      {authChecking ? (
        <Spinner size="xl" aria-label="Center-aligned" />
      ) : (
        <>
          {props.login ? (
            <LoginSection handleLogin={handleLogin} />
          ) : (
            <SignupSection handleSignup={handleSignup} />
          )}
        </>
      )}
      {formError && <FormError message={formError} />}
    </>
  );
};

export default LoginPage;
