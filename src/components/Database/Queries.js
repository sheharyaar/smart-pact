const FetchUserDetails = (props) => {
  return new Promise(async (resolve, reject) => {
    if (
      props.token === undefined ||
      props.email === undefined ||
      props.token === null ||
      props.email === null
    ) {
      return;
    }

    const userOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: props.token,
        email: props.email,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/userDetails",
        userOptions
      );
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        console.log("FetchUserDetails : ", data);
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      console.error("FetchUserDetails : ", error);
      reject(error);
    }
  });
};

export { FetchUserDetails };
