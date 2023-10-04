const FetchPdfList = (props) => {
  return new Promise(async (resolve, reject) => {
    if (
      props.token === undefined ||
      props.user_id === undefined ||
      props.token === null ||
      props.user_id === null
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
        user_id: props.user_id,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/api/userPdfList",
        userOptions
      );

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        console.log("FetchPdfList : ", data);
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      console.error("FetchPdfList : ", error);
      reject(error);
    }
  });
};

// TODO: SHEHAR: Complete this
const VerifyPdfId = (props) => {
  return new Promise(async (resolve, reject) => {
    resolve(true);
  });
};

export { FetchPdfList, VerifyPdfId };
