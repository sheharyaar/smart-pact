import { Modal, Tabs, FileInput, Button } from "flowbite-react";
import { useCallback, useContext } from "react";
import { DashboardContext } from "./Dashboard";
import { tabTheme } from "../../components/FlowBiteStyles/Styles";
import { useRef } from "react";

const AddPdfModal = () => {
  const { addPdfModal, setAddPdfModal } = useContext(DashboardContext);
  const formRef = useRef(null);
  const fileRef = useRef(null);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    const currFile = fileRef?.current;
    if (!currFile) return;

    // TODO: SHEHAR: Use file read and upload logic
    console.log(currFile);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileRef.current = file;
    formRef?.current.click();
  }, []);

  return (
    <Modal dismissible show={addPdfModal} onClose={() => setAddPdfModal(false)}>
      <Modal.Header>
        <Tabs.Group
          aria-label="Underlined tabs"
          // eslint-disable-next-line react/style-prop-object
          style="underline"
          theme={tabTheme}
        >
          <Tabs.Item active title="New Document">
            Sheharyaar
          </Tabs.Item>
          <Tabs.Item title="Upload Document">
            <form onSubmit={(ev) => handleFormSubmit(ev)}>
              <FileInput onChange={handleFileUpload} accept="application/pdf" />
              <Button className="hidden" type="submit" ref={formRef}>
                Upload
              </Button>
            </form>
          </Tabs.Item>
        </Tabs.Group>
      </Modal.Header>
    </Modal>
  );
};

export { AddPdfModal };
