import { Modal, Tabs, FileInput, Button, Spinner } from "flowbite-react";
import { useCallback, useContext } from "react";
import { DashboardContext } from "./Dashboard";
import { tabTheme } from "../../components/FlowBiteStyles/Styles";
import { useRef, useEffect, useState } from "react";
import DropBoxTemplate from "./DropboxTemplate";
import { HelloSignAuth } from "../../components/HelloSign/HelloSignAuth";

const AddPdfModal = () => {
  const { addPdfModal, setAddPdfModal } = useContext(DashboardContext);
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [signTemplateLoading, setSignTemplateLoading] = useState(false);

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

  useEffect(() => {}, []);

  return (
    <Modal dismissible show={addPdfModal} onClose={() => setAddPdfModal(false)}>
      <Modal.Body>
        <Tabs.Group
          aria-label="Underlined tabs"
          // eslint-disable-next-line react/style-prop-object
          style="underline"
          theme={tabTheme}
        >
          <Tabs.Item active title="New Document">
            {/* TODO: Add Spinner for loading, import from Dropbox Sign or create new */}
            {signTemplateLoading ? (
              <div className="text-center">
                <Spinner
                  size="xl"
                  className="fill-[#4d4dc7] justify-self-center"
                  aria-label="Center-aligned"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <HelloSignAuth>
                  <DropBoxTemplate />
                </HelloSignAuth>
                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                  <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                    or
                  </span>
                </div>
                <Button
                  outline
                  className="bg-primary-700 enabled:hover:bg-primary-800"
                >
                  Create an empty document
                </Button>
              </div>
            )}
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
      </Modal.Body>
    </Modal>
  );
};

export { AddPdfModal };
