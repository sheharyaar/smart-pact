import { EditorContext } from "./EditorPage";
import { useContext, useEffect, useState } from "react";
import { PdfAnalyseText } from "../../components/PdfEditor/PdfEditorUtils";
import { Spinner, Sidebar } from "flowbite-react";

const AnalysePdfModal = () => {
  const { analysePdfModal, instance, document } = useContext(EditorContext);
  const [isAnalysingPdf, setIsAnalysingPdf] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    PdfAnalyseText({ instance: instance, document: document })
      .then((data) => {
        const bBoxes = data.bBoxes;
        const boxes = bBoxes.map((textLine) => textLine.boundingBox);
        const summary = data.summary;
        const ambiguous = data.ambiguous;

        if (bBoxes.length > 0) {
          (async function () {
            const PSPDFKit = await import("pspdfkit");

            instance?.current.create(
              new PSPDFKit.Annotations.HighlightAnnotation({
                pageIndex: 0,
                rects: boxes,
                boundingBox: PSPDFKit.Geometry.Rect.union(boxes),
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
    <>
      <div>
        <Sidebar>
          {isAnalysingPdf ? (
            <div className="text-center">
              <Spinner
                size="xl"
                className="fill-primary-700 justify-self-center"
                aria-label="Center-aligned"
              />
            </div>
          ) : (
            <div>
              <h2> Summary</h2>
              <p>{summary.summary}</p>
              <hr />
              <h3>Actionable Points</h3>
              <p>{summary.ambiguous}</p>
            </div>
          )}
        </Sidebar>
      </div>
    </>
  );
};

export { AnalysePdfModal };
