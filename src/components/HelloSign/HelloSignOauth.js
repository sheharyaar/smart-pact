import { Button, Spinner } from "flowbite-react";
import { useState, useCallback, useContext } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../App";

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
  const { setSignAuthToken } = useContext(AuthContext);
  const [btnIsLoading, setBtnLoading] = useState(false);

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
        sessionStorage.setItem("DROPBOX_SIGN_OAUTH_ID", token);
        setSignAuthToken(token);
        setBtnLoading(false);
      }
    },
    [setSignAuthToken]
  );

  const handleHelloSignOauth = useCallback(async () => {
    setBtnLoading(true);

    // save the document
    const state = randomString(8);
    const url = `https://app.hellosign.com/oauth/authorize?response_type=code&client_id=973b3a1562379a15e47fb44b611b8388&state=${state}`;

    // Open the current for authentication
    window.open(url, "_blank");
  }, []);

  useEffect(() => {
    window.addEventListener("message", receiveMessage);

    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [receiveMessage, setSignAuthToken]);

  return (
    <>
      <p className="text-base leading-relaxed text-gray-800">
        Your DropboxSign account is not loaded.
      </p>
      <br />
      <Button
        className="bg-[#5e5ceb] enabled:hover:bg-[#4d4dc7]"
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
    </>
  );
};

export { HelloSignOauth };
