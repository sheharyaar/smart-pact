import { useCallback, useContext, useEffect, useRef } from "react";
import { EditorContext } from "../../pages/EditorPage/EditorPage";
import { PdfPublish, PdfSave } from "./PdfEditorUtils";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthNavContext } from "../AuthNav/AuthNav";

const UnneededPlugins = ["signature", "note"];
const viewerPlugins = ["multi-annotations-selection", "print", "export-pdf"];

const signatureSvg = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 256 256" class="mr-2 h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M232,172H57.32c4-7.83,8.18-16.11,12.21-24.56,15.17,3.56,34.17-8.08,56.62-34.68a109.73,109.73,0,0,0,4.11,11.44c6,13.94,13.37,21.85,22,23.49,9.8,1.85,19.83-4.22,30.49-18.54C187.38,137.33,199.59,148,232,148a4,4,0,0,0,0-8c-42.88,0-44-19.24-44-20a4,4,0,0,0-7.87-1c-9.93,15-19,22.23-26.34,20.84-12.21-2.31-19.93-27.23-21.87-36.64a4,4,0,0,0-7.56-.85c-20.74,25.85-38.67,38.9-51.29,37.56C97.31,87.5,105.19,53.16,96.49,37.77,94,33.33,88.74,28,78,28h-.18c-13.78.1-25.27,14.51-30.76,38.59C43.62,81.8,43,98.72,45.5,113c2.64,15.26,8.37,26,16.65,31.32-4.57,9.59-9.29,19-13.84,27.68H24a4,4,0,0,0,0,8H44.1c-12.87,24.17-23.37,41.68-23.53,41.94a4,4,0,0,0,1.37,5.49A3.93,3.93,0,0,0,24,228a4,4,0,0,0,3.43-1.94c.16-.27,11.85-19.75,25.72-46.06H232a4,4,0,0,0,0-8ZM53.39,111.64a114.51,114.51,0,0,1,1.5-43.27C58.45,52.74,66.39,36,78,36c7.48,0,10.18,3.26,11.56,5.7C99,58.4,79.92,106,65.6,137,59.78,132.68,55.49,123.83,53.39,111.64Z"></path></svg>`;
const aiSvg = `<svg role="graphics-symbol" viewBox="0 0 14 17" class="sparkles" style="width: 18px; height: 18px; display: block; fill: rgb(128, 83, 175); flex-shrink: 0; padding-left: 4px;"><path d="M6.417 4.074c.096 0 .157-.061.178-.157.191-1.114.184-1.128 1.36-1.36.096-.02.157-.076.157-.178 0-.096-.061-.157-.157-.171-1.176-.219-1.155-.24-1.36-1.36-.02-.096-.082-.164-.178-.164-.096 0-.157.068-.178.164-.205 1.107-.177 1.12-1.36 1.36-.096.014-.157.075-.157.17 0 .103.061.158.164.179 1.169.225 1.162.232 1.353 1.36.02.096.082.157.178.157zM3.095 8.921c.15 0 .266-.11.287-.253.232-1.798.28-1.812 2.167-2.16a.276.276 0 00.246-.28c0-.15-.11-.267-.253-.28-1.873-.26-1.928-.315-2.16-2.154-.02-.15-.13-.26-.287-.26-.15 0-.26.11-.28.267-.22 1.798-.294 1.798-2.168 2.146-.15.02-.252.13-.252.28 0 .158.102.26.28.28 1.846.288 1.92.35 2.14 2.147.02.158.13.267.28.267zm4.82 7.54c.211 0 .375-.15.41-.376.498-3.67 1.01-4.252 4.655-4.662a.416.416 0 00.39-.41c0-.22-.165-.383-.39-.417-3.61-.431-4.123-.957-4.656-4.662-.04-.22-.198-.37-.41-.37-.212 0-.376.15-.41.37-.5 3.677-1.012 4.258-4.655 4.662-.226.027-.39.198-.39.417 0 .212.164.383.39.41 3.602.492 4.101.964 4.655 4.662.04.226.198.376.41.376z"></path></svg>`;

const PdfEditor = () => {
  const containerRef = useRef(null);
  const { supabase } = useContext(AuthContext);
  const { setIsEditorPage, setAuthPdf } = useContext(AuthNavContext);
  const { instance, document } = useContext(EditorContext);
  const { editorUrls, setHelloSignModal, handlePdfAnalyse } =
    useContext(EditorContext);

  try {
    if (editorUrls.diff_json === null || editorUrls.diff_json === undefined) {
      editorUrls.diff_json = "{}";
    }

    const pdfDiff = JSON.parse(editorUrls.diff_json);
    if (pdfDiff === null || pdfDiff === undefined)
      throw new Error("PdfEditor : json is null or undefined");
  } catch (e) {
    console.error("PdfEditor : error in parsing diff json", e);
  }

  const handlePdfPublish = useCallback(() => {
    toast.info("Publishing PDF", {
      position: toast.POSITION.TOP_RIGHT,
    });
    // pdf file export
    PdfPublish({
      instance: instance,
      supabase: supabase,
      pdf_id: document,
    })
      .then((data) => {
        toast.success("PDF Published", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        console.error("PdfPublish : error publishing pdf", e);
      });
  }, [instance, supabase, document]);

  const handlePdfSave = useCallback(() => {
    toast.info("Saving PDF", {
      position: toast.POSITION.TOP_RIGHT,
    });
    PdfSave({ instance: instance, supabase: supabase, pdf_id: document })
      .then((data) => {
        toast.success("PDF Saved", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        console.error("PdfSave : error saving pdf", e);
      });
  }, [instance, supabase, document]);

  const keyDownHandler = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        e.preventDefault();
        handlePdfSave();
      }
    },
    [handlePdfSave]
  );

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      // Toolbar items
      let toolbarItems;
      if (editorUrls.role === "editor") {
        toolbarItems = PSPDFKit.defaultToolbarItems.filter((item) => {
          return !UnneededPlugins.includes(item.type);
        });
      } else {
        toolbarItems = PSPDFKit.defaultToolbarItems.filter((item) => {
          return viewerPlugins.includes(item.type);
        });
      }

      toolbarItems.push({
        type: "spacer",
      });

      // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
      toolbarItems.push({
        type: "custom",
        id: "toolbar-insert-signature",
        icon: signatureSvg,
        title: "Insert Signature",
        onPress: () => {
          setHelloSignModal(true);
        },
      });

      if (editorUrls.role === "editor") {
        toolbarItems.push({
          type: "custom",
          id: "save-file",
          title: "Save",
          onPress: () => {
            handlePdfSave();
          },
        });

        toolbarItems.push({
          type: "custom",
          id: "publish-file",
          title: "Publish",
          onPress: () => {
            handlePdfPublish();
          },
        });
      }

      // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
      toolbarItems.push({
        type: "custom",
        id: "toolbar-analyse-pdf",
        title: "Analyse Document",
        icon: aiSvg,
        onPress: () => {
          handlePdfAnalyse();
        },
      });

      instance.current = await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        enableHistory: true,
        toolbarItems: toolbarItems.reduce((acc, item) => {
          // Position the undo and redo buttons after the last annotation button, polyline.
          if (item.type === "polyline") {
            return acc.concat([item, { type: "undo" }, { type: "redo" }]);
          }
          return acc.concat([item]);
        }, []),

        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
        instantJSON: editorUrls.diff_obj,
        document: editorUrls.pdf_url,
      });

      instance.current.contentDocument.addEventListener(
        "keydown",
        keyDownHandler
      );

      setIsEditorPage(true);
      setAuthPdf({ name: editorUrls.pdf_name, role: editorUrls.role });
      // save the thumbnail to the database
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [
    setHelloSignModal,
    instance,
    editorUrls,
    keyDownHandler,
    handlePdfSave,
    handlePdfPublish,
    document,
    handlePdfAnalyse,
    setAuthPdf,
    setIsEditorPage,
  ]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "92vh" }}></div>
  );
};

export default PdfEditor;
