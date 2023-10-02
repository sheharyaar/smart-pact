"use client";

import { Modal } from "flowbite-react";
import { useContext } from "react";
import { EditorContext } from "./EditorPage";
import { HelloSignOauth } from "../../components/HelloSign/HelloSignOauth";
import { AuthContext } from "../../App";

const HelloSignModal = () => {
  // auth contexts
  const { signAuthToken } = useContext(AuthContext);
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
          {signAuthToken === null ? (
            <HelloSignOauth />
          ) : (
            // TODO: SHEHAR: Get signratures
            `Got token : ${signAuthToken}`
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HelloSignModal;
