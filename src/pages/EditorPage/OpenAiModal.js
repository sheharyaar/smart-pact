import { Modal, Button, TextInput } from "flowbite-react";
import { useCallback, useContext, useRef } from "react";
import { EditorContext } from "./EditorPage";
import { buttonTheme, formTheme } from "../../components/FlowBiteStyles/Styles";
import { toast } from "react-toastify";

const OpenAiModal = () => {
  // auth contexts
  const { openAiModal, setOpenAiModal, setShowAnalyseModal } =
    useContext(EditorContext);
  const openAiKeyRef = useRef(null);

  const handleOpenAiSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const openAiKey = openAiKeyRef.current.value;
      if (openAiKey === null || openAiKey === undefined || openAiKey === "") {
        toast.error("Please enter a valid OpenAI API Key");
      }
      sessionStorage.setItem("OPEN_AI_KEY", openAiKey);
      setOpenAiModal(false);
      setShowAnalyseModal(true);
    },
    [setOpenAiModal, setShowAnalyseModal]
  );

  return (
    <>
      <Modal
        dismissible
        show={openAiModal}
        onClose={() => setOpenAiModal(false)}
      >
        <Modal.Header>OpenAI API Key</Modal.Header>
        <Modal.Body className="text-center flex flex-row gap-4 items-center">
          <TextInput
            theme={formTheme.textInput}
            id="openaikey"
            required
            type="text"
            maxLength={128}
            ref={openAiKeyRef}
            placeholder="Your OpenAI API Key"
          />
          <Button
            theme={buttonTheme}
            type="submit"
            onClick={handleOpenAiSubmit}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { OpenAiModal };
