import { HFGenerateText } from "../HuggingFace/HuggingFace";
import PSPDFKit from "pspdfkit";

const PdfAnalyseText = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const openAiKey = sessionStorage.getItem("OPEN_AI_KEY");
      if (openAiKey === null || openAiKey === undefined || openAiKey === "") {
        throw Error("PdfAnalyseText : openAiKey is null or undefined");
      }

      const instance = props.instance?.current;
      if (instance === null || instance === undefined) {
        console.error("AnalyseText : instance is undefined or null");
        return;
      }

      const currPageIndex = instance.viewState?.currentPageIndex;
      if (currPageIndex === null || currPageIndex === undefined) {
        console.error("AnalyseText : currPageIndex is undefined or null");
        return;
      }
      const textLines = await instance.textLinesForPageIndex(currPageIndex);
      // filter out only the pageIndex, id and the text content
      const filteredTextLines = textLines.map((textLine) => {
        return {
          pageIndex: textLine.pageIndex,
          id: textLine.id,
          text: textLine.contents,
        };
      });

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          openAiKey: openAiKey,
          input: filteredTextLines,
        }),
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/ai/analyseDoc`,
        options
      );
      if (resp.status >= 200 && resp.status < 300) {
        const data = await resp.json();

        // fetch bounding box from global textLines and add them to the parsed
        // ambiguous object for each entry
        const parsed = JSON.parse(data.content);
        const ambiguous = parsed.ambiguous;
        const bBoxes = textLines.filter((textLine) => {
          return ambiguous.some((amb) => {
            return amb.id === textLine.id;
          });
        });

        resolve({ data: parsed, bBoxes: bBoxes });
      } else {
        reject(new Error(`HTTP Error ${resp.status}`));
      }
    } catch (e) {
      console.error("PdfAnalyseText : error analysing text", e);
      reject(e);
    }
  });
};

const GenerateFromJSON = (props) => {
  return new Promise(async (resolve, reject) => {
    const instance = props.instance?.current;
    if (instance === null || instance === undefined) {
      throw Error("GenerateFromJSON : instance is undefined or null");
    }

    const json = props.json;
    if (json === null || json === undefined) {
      throw Error("GenerateFromJSON : json is undefined or null");
    }

    console.log("Height ", instance.pageInfoForIndex(0).height);
    console.log("Width ", instance.pageInfoForIndex(0).width);

    try {
      const parsed_json = JSON.parse(json);
      const annotations = parsed_json?.annotations;
      if (annotations === null || annotations === undefined) {
        throw Error("GenerateFromJSON : annotations is undefined or null");
      }

      for (let i = 0; i < annotations.length; i++) {
        let generated = null;
        const annotation = annotations[i];
        console.log(annotation);
        switch (annotation.type) {
          case "text_annotation":
            generated = new PSPDFKit.Annotations.TextAnnotation({
              pageIndex: annotation.page_index,
              font: annotation.font,
              boundingBox: new PSPDFKit.Geometry.Rect(annotation.bounding_box),
              text: annotation.text,
              isBold: annotation.is_bold,
              horizontalAlign: annotation.horizontal_align,
              fontSize: annotation.font_size,
            });
            break;
          case "widget_annotation":
            console.log("WidgetAnnotation");
            console.log(annotation);
            break;
          case "link_annotation":
            console.log("LinkAnnotation");
            console.log(annotation);
            break;
          case "line_annotation":
            console.log("LineAnnotation");
            console.log(annotation);
            break;
          case "polyline_annotation":
            console.log("PolylineAnnotation");
            console.log(annotation);
            break;
          case "shape_annotation":
            console.log("ShapeAnnotation");
            console.log(annotation);
            break;
          case "image_annotation":
            console.log("ImageAnnotation");
            console.log(annotation);
            break;
          default:
            console.error(
              `GenerateFromJSON : unknown annotation type ${annotation.type}`
            );
            break;
        }
        if (generated !== null) {
          try {
            const [createdAnnotation] = await instance.create(generated);
            console.log(createdAnnotation.id); // => '01BS964AM5Z01J9MKBK64F22BQ'
          } catch (e) {
            console.error("GenerateFromJSON : error creating annotation", e);
          }
        } else {
          console.error("GenerateFromJSON : generated is null");
        }
      }
    } catch (e) {
      console.error("GenerateFromJSON : json is not valid", e);
      reject(e);
    }
  });
};

const PdfGenerateText = (props) => {
  const instance = props.instance?.current;
  if (instance === null || instance === undefined) {
    console.error("GenerateText : instance is undefined or null");
    return;
  }

  const prompt = props.prompt;
  if (prompt === null || prompt === undefined) {
    console.error("GenerateText : prompt is undefined or null");
    return;
  }

  HFGenerateText(prompt)
    .catch((e) => {
      console.error("error in HFGenerateText :", e);
      return;
    })
    .then((hf_response) => {
      console.log("HFGenerateText : success");
      GenerateFromJSON({ instance: props.instance, json: hf_response })
        .then(() => {
          console.log("HFGenerateText : success");
          return;
        })
        .catch((e) => {
          console.error("GenerateText : error generating text", e);
          return;
        });
    });
};

const PdfSave = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const instance = props.instance.current;
      if (instance === null || instance === undefined) {
        console.error("PdfSave : instance is undefined or null");
        return;
      }

      const diff_json = await instance.exportInstantJSON();
      if (diff_json === null || diff_json === undefined) {
        reject("Could not fetch PDF state");
      }

      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.session.user.id,
          pdf_id: props.pdf_id,
          json_diff: JSON.stringify(diff_json),
        }),
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/savePdf`,
        options
      );
      if (resp.status >= 200 && resp.status < 300) {
        resolve("Saved");
      } else {
        reject("Error in PDF");
      }
    } catch (e) {
      console.error("PdfSave : error saving pdf", e);
      reject(e);
    }
  });
};

// Save to local/session storage, the json only. the pdf will be fetched from the server
const PdfPublish = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      const pdfArrayBuffer = await props.instance.current.exportPDF({
        flatten: true,
      });
      if (pdfArrayBuffer === null || pdfArrayBuffer === undefined) {
        throw Error("PdfPublish : pdfArrayBuffer is null or undefined");
      }
      let formData = new FormData(); //formdata object=

      formData.append(
        "file",
        new Blob([pdfArrayBuffer], { type: "application/pdf" })
      );
      formData.append("pdf_id", props.pdf_id);
      formData.append("user_id", data.session.user.id);

      const options = {
        method: "POST",
        body: formData,
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/publishPdf`,
        options
      );
      if (resp.status >= 200 && resp.status < 300) {
        await resp.json();
        resolve("success");
      } else {
        reject(new Error(`HTTP Error ${resp.status}`));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

// TODO: SHEHAR: Complete this
// Fetch the json from session storage / server and the history of pdfs
// Then sort them according to the dat and load them on demand
const PdfTimeline = (props) => {};

export { PdfAnalyseText, PdfGenerateText, PdfSave, PdfPublish, PdfTimeline };
