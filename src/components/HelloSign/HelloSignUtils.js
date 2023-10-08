// TODO: SHEHAR: Complete this
const FetchSignatures = (props) => {};

const FetchTemplates = (props) => {
  return new Promise(async (resolve, reject) => {
    if (props?.token === undefined || props?.page === undefined)
      reject(new Error("Invalid Arguments"));
    if (props.token === null || props.token === "")
      reject(new Error("Invalid Token"));
    if (props.page === null || props.page === "")
      reject(new Error("Invalid Page"));

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: props.token,
        account_id: "sample-id",
        page: props.page,
      }),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/helloSign/fetchTemplates`,
        options
      );
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      console.error("FetchTemplates : ", error);
      reject(error);
    }
  });
};

// TODO: SHEHAR: Add Signature
// TODO: SHEHAR: Add Templates
export { FetchSignatures, FetchTemplates };
