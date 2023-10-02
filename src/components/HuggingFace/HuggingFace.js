/*
    AI Integrations :
    - Analysis of given contents
    - Return text on generation
*/

const HFAnalyseText = (props) => {
  console.log(props);
};

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
        "http://localhost:8000/huggingface/generateDoc",
        requestOptions
      );
      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        console.log("HFGenerateText : ", data);
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

export { HFAnalyseText, HFGenerateText };
