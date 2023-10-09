import { Button, Spinner } from "flowbite-react";
import { useState, useCallback } from "react";
import { useEffect, useContext } from "react";
import { SignAuthContext } from "./HelloSignAuth";

const randomString = (length) => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; ++i) {
    result += alphabet[Math.floor(alphabet.length * Math.random())];
  }
  return result;
};

const HelloSignOauth = () => {
  const svgDropbox = `${process.env.PUBLIC_URL}/dropbox-sign-oauth.svg`;
  const [btnIsLoading, setBtnLoading] = useState(false);
  const { signToken, setSignToken } = useContext(SignAuthContext);

  // receive message from the oauth popup/page
  const receiveMessage = useCallback(
    (event) => {
      if (event.origin !== window.location.origin) {
        console.warn(`Message received by ${event.origin}; IGNORED.`);
        return;
      }

      const id = event.data?.id;
      const token = event.data?.token;
      if (id === undefined || token === undefined) {
        console.error(`Received message with invalid data.`);
        return;
      }

      if (id !== "hello_sign_oauth") {
        console.error(`Received message with invalid id.`);
      } else {
        // set to local storage
        if (token !== null || token !== undefined) {
          sessionStorage.setItem("DROPBOX_SIGN_OAUTH_ID", token);
          setSignToken(token);
        }
        setBtnLoading(false);
      }
    },
    [setSignToken]
  );

  const handleHelloSignOauth = useCallback(async () => {
    setBtnLoading(true);

    // save the document
    const state = randomString(8);
    const url = `https://app.hellosign.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_DROPBOX_SIGN_CLIENT_ID}&state=${state}`;

    // Open the current for authentication
    window.open(url, "_blank");
  }, []);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [receiveMessage]);

  return (
    <>
      {(signToken === null || signToken === undefined) && (
        <div className="flex flex-col text-center items-center">
          <p className="text-base leading-relaxed text-gray-800">
            Your DropboxSign account is not loaded.
          </p>
          <br />
          <Button
            className="bg-primary-700 enabled:hover:bg-primary-800 w-fit"
            onClick={handleHelloSignOauth}
            isProcessing={btnIsLoading}
            processingSpinner={<Spinner className="fill-[#5e5ceb]" />}
            disabled={btnIsLoading}
          >
            <div className="text-white flex flex-row h-6 text-base leading-relaxed">
              Sign in with
              <img src={svgDropbox} alt="dropbox oauth sign" />
            </div>
          </Button>
        </div>
      )}
    </>
  );
};

export { HelloSignOauth };
