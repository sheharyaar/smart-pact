import { Spinner } from "flowbite-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// handles oauth sign in redirct and then sends it to the backend
const HelloSignOauthCb = () => {
  const [searchParams] = useSearchParams();
  let code = searchParams.get("code");
  let state = searchParams.get("state");

  useEffect(() => {
    // go for auth token from backend and store in localstorage
    if (window.opener == null) window.location = "/";

    let sign_data = {
      id: "hello_sign_oauth",
      token: null,
    };

    (async function () {
      // send the client stuff to backend for auth token
      const requestOptions = {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code, state: state }),
      };
      await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/helloSign/oauthToken`,
        requestOptions
      )
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            return response.json();
          } else {
            // Handle non-successful HTTP responses
            throw new Error(`HTTP Error ${response.status}`);
          }
        })
        .then(
          (data) => {
            const access_token = data.access_token;
            sign_data = { ...sign_data, token: access_token };
            window.opener.postMessage(sign_data);
            window.close();
          },
          (err) => {
            console.error(`error in fetching response data : ${err}`);
            throw err;
          }
        )
        .catch((err) => {
          console.error(`Caught error : ${err}`);
          window.opener.postMessage(sign_data);
          window.close();
        });
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // need to run only once

  return (
    <div className="w-100  text-center justify-center absolute top-1/2 left-1/2">
      <Spinner
        size="xl"
        aria-label="Center-aligned"
        className="fill-[#4d4dc7]"
      />
    </div>
  );
};

export { HelloSignOauthCb };
