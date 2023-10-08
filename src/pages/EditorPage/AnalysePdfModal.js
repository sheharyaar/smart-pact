import { EditorContext } from "./EditorPage";
import { useContext, useEffect, useState } from "react";
import { PdfAnalyseText } from "../../components/PdfEditor/PdfEditorUtils";
import { Spinner, Modal } from "flowbite-react";
import { modalSideBarTheme } from "../../components/FlowBiteStyles/Styles";

const AnalysePdfModal = (props) => {
  const { instance, document, setShowAnalyseModal } = useContext(EditorContext);
  const [isAnalysingPdf, setIsAnalysingPdf] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    PdfAnalyseText({ instance: instance, document: document })
      .then((data) => {
        const bBoxes = data.bBoxes;
        const boxes = bBoxes.map((textLine) => textLine.boundingBox);
        const summary = data.data.summary;
        const ambiguous = data.data.ambiguous;

        if (bBoxes.size > 0) {
          (async function () {
            const PSPDFKit = await import("pspdfkit");

            instance?.current.create(
              new PSPDFKit.Annotations.HighlightAnnotation({
                pageIndex: 0,
                rects: boxes,
                boundingBox: PSPDFKit.Geometry.Rect.union(boxes),
                color: new PSPDFKit.Color({ r: 243, g: 164, b: 168 }),
              })
            );
          })();
        }

        setIsAnalysingPdf(false);
        setSummary({
          summary: summary,
          ambiguous: ambiguous,
        });
      })
      .catch((e) => {
        console.error("PdfAnalyseText : error analysing pdf", e);
      });
  }, [instance, document]);

  return (
    <Modal
      theme={modalSideBarTheme}
      dismissible
      position="center-left"
      show={true}
      onClose={() => setShowAnalyseModal(false)}
    >
      <Modal.Header theme={modalSideBarTheme.header}>AI Analysis</Modal.Header>
      <Modal.Body theme={modalSideBarTheme.body}>
        {isAnalysingPdf ? (
          <div className="text-center absolute top-1/2 left-1/2 -translate-x-1/2">
            <Spinner
              size="xl"
              className="fill-[#4d4dc7] justify-self-center"
              aria-label="Center-aligned"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <h2>Summary</h2>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {summary.summary}
            </p>
            {summary.ambiguous && summary.ambiguous.length > 0 && (
              <>
                <h2>Points to Consider</h2>
                {summary.ambiguous.map((point, index) => (
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {point.text}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export { AnalysePdfModal };
