import { createContext, useEffect, useState } from "react";
import { HelloSignOauth } from "./HelloSignOauth";
import { Spinner } from "flowbite-react";

const SignAuthContext = createContext({
  signToken: null,
  setSignToken: () => {},
});

const HelloSignAuth = (props) => {
  const [signToken, setSignToken] = useState(null);
  const [checkingAuth, setcheckingAuth] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("DROPBOX_SIGN_OAUTH_ID");
    if (token === "" || token === null || token === undefined) {
      setSignToken(null);
    } else {
      setSignToken(token);
    }

    setcheckingAuth(false);
  }, []);

  return (
    <SignAuthContext.Provider value={{ signToken, setSignToken }}>
      {checkingAuth ? (
        <div className="text-center">
          <Spinner
            size="xl"
            className="fill-[#4d4dc7] justify-self-center"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
        <>
          {signToken === null || signToken === undefined ? (
            <HelloSignOauth />
          ) : (
            <div>{props.children}</div>
          )}
        </>
      )}
    </SignAuthContext.Provider>
  );
};

export { HelloSignAuth, SignAuthContext };
