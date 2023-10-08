import { Modal, Button } from "flowbite-react";
import { useCallback, useContext, useState, useRef } from "react";
import { EditorContext } from "./EditorPage";
import { PdfGenerateText } from "../../components/PdfEditor/PdfEditorUtils";

const GeneratePdfModal = () => {
  const { showGeneratePdfModal, setGeneratePdfModal, instance } =
    useContext(EditorContext);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const promptRef = useRef(null);

  const generatePdf = useCallback(
    (ev) => {
      ev.preventDefault();
      const prompt = promptRef.current?.value;
      if (prompt === undefined || prompt === null) {
        console.error("GeneratePdfModal : prompt is undefined or null");
        return;
      }

      setIsGeneratingPdf(true);
      PdfGenerateText({ instance: instance, prompt: prompt });
    },
    [setIsGeneratingPdf, instance]
  );

  return (
    <>
      <Modal
        show={showGeneratePdfModal}
        onClose={() => setGeneratePdfModal(false)}
        dismissible
      >
        <Modal.Header>Generate PDF</Modal.Header>
        <Modal.Body>
          <form onSubmit={(ev) => generatePdf(ev)}>
            <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                <label htmlFor="ai-prompt" className="sr-only">
                  Propmt for generation
                </label>
                <textarea
                  id="ai-prompt"
                  rows="4"
                  className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="I want to generate a PDF for Employee agreement ..."
                  required={true}
                  ref={promptRef}
                ></textarea>
              </div>
            </div>
            <Button
              isProcessing={isGeneratingPdf}
              disabled={isGeneratingPdf}
              type="submit"
              className="text-white bg-[#5e5ceb] enabled:hover:bg-[#4d4dc7] "
            >
              Generate
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GeneratePdfModal;
