import { useContext, useEffect, useRef } from "react";
import { PdfAnalyseText } from "./PdfEditorUtils";
import { EditorContext } from "../../pages/EditorPage/EditorPage";

const UnneededPlugins = ["signature", "note"];

const PdfEditor = () => {
  const containerRef = useRef(null);
  const { instance } = useContext(EditorContext);

  const { document, setHelloSignModal, setGeneratePdfModal } =
    useContext(EditorContext);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      // Toolbar items
      const toolbarItems = PSPDFKit.defaultToolbarItems.filter((item) => {
        return !UnneededPlugins.includes(item.type);
      });

      toolbarItems.push({
        type: "spacer",
      });

      // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
      toolbarItems.push({
        type: "custom",
        id: "toolbar-insert-signature",
        title: "Insert Signature",
        onPress: () => {
          setHelloSignModal(true);
        },
      });

      // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
      toolbarItems.push({
        type: "custom",
        id: "toolbar-generate-pdf",
        title: "Generate Content",
        onPress: () => {
          setGeneratePdfModal(true);
        },
      });

      // A custom item. Inside the onPress callback we can call into PSPDFKit APIs.
      toolbarItems.push({
        type: "custom",
        id: "toolbar-analyse-pdf",
        title: "Analyse content",
        onPress: () => {
          PdfAnalyseText({ instance });
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
        // The document to open.
        document: document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [setHelloSignModal, setGeneratePdfModal, document, instance]);

  return <div ref={containerRef} style={{ width: "100%", height: "92vh" }} />;
};

export default PdfEditor;
