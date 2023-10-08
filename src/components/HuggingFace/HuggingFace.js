const HFGenerateText = (prompt) => {
  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/huggingface/generateDoc`,
        requestOptions
      );
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      console.error("HFGenerateText : ", error);
      reject(error);
    }
  });
};

export { HFGenerateText };
