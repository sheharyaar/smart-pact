import { Modal } from "flowbite-react";
import { useContext } from "react";
import { EditorContext } from "./EditorPage";
import { HelloSignAuth } from "../../components/HelloSign/HelloSignAuth";

const HelloSignModal = (props) => {
  // auth contexts
  const { showHelloSignModal, setHelloSignModal } = useContext(EditorContext);

  return (
    <>
      <Modal
        dismissible
        show={showHelloSignModal}
        onClose={() => setHelloSignModal(false)}
      >
        <Modal.Header>DropboxSign Signature</Modal.Header>
        <Modal.Body className="text-center flex flex-col items-center">
          <HelloSignAuth>
            {/* // TODO: SHEHAR: Get signratures */}
            <div>Got token signature</div>
          </HelloSignAuth>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HelloSignModal;
