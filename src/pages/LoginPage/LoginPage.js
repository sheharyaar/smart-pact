import { Button } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

const LoginPage = () => {
  const { appAuthToken, setAppAuthToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    if (appAuthToken) {
      navigate("/dashboard");
    }

    setAuthChecking(false);
  }, [navigate, appAuthToken]);

  const handleLoginClick = useCallback(() => {
    setAppAuthToken("test");
    sessionStorage.setItem("SMART_PACT_AUTH_ID", "test");
  }, [setAppAuthToken]);

  return (
    <>
      {authChecking ? (
        <Spinner size="xl" aria-label="Center-aligned" />
      ) : (
        <div>
          <h1>LoginPage</h1>
          <Button onClick={handleLoginClick}>Login/Signup</Button>
        </div>
      )}
    </>
  );
};

export default LoginPage;
