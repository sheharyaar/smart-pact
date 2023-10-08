import { Modal, Tabs, FileInput, Button, TextInput } from "flowbite-react";
import { useCallback, useContext } from "react";
import { DashboardContext } from "./Dashboard";
import { tabTheme } from "../../components/FlowBiteStyles/Styles";
import { useRef } from "react";
import DropBoxTemplate from "./DropboxTemplate";
import { HelloSignAuth } from "../../components/HelloSign/HelloSignAuth";
import { CreateEmptyDoc } from "../../components/Database/Queries";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { CreateUploadDoc } from "../../components/Database/Queries";
import { toast } from "react-toastify";

const AddPdfModal = () => {
  const { addPdfModal, setAddPdfModal } = useContext(DashboardContext);
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const textRef = useRef(null);
  const navigate = useNavigate();
  const { supabase } = useContext(AuthContext);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const currFile = fileRef?.current;
      if (!currFile) return;

      // file size limit 5mb
      if (currFile.size > 5000000) {
        alert("File size is too big (max 5Mb)");
        return;
      }

      let formData = new FormData(); //formdata object
      formData.append("file", currFile); //append the values with key, value pair
      formData.append("file_name", currFile.name);

      CreateUploadDoc({ supabase, formData })
        .then((data) => {
          navigate(`/editor/${data.pdf_id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [supabase, navigate]
  );

  const handleFileUpload = useCallback((e) => {
    toast.info("Uploading PDF", {
      position: toast.POSITION.TOP_RIGHT,
    });
    const file = e.target.files[0];
    if (!file) return;

    fileRef.current = file;
    formRef?.current.click();
  }, []);

  const handleEmptyDoc = useCallback(
    (e) => {
      e.preventDefault();

      const doc_name = textRef?.current?.value;
      if (doc_name === undefined || doc_name === null || doc_name === "")
        throw new Error("Document name cannot be empty");

      CreateEmptyDoc({
        supabase: supabase,
        document_title: doc_name,
      })
        .then((data) => {
          const pdf_id = data?.pdf_id;
          if (pdf_id === undefined || pdf_id === null || pdf_id === "")
            throw new Error("invalid PDF");

          navigate(`/editor/${data.pdf_id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    [supabase, navigate]
  );

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
              <div className="flex flex-row gap-4">
                <TextInput
                  maxLength={64}
                  placeholder="Document Name"
                  ref={textRef}
                ></TextInput>
                <Button
                  outline
                  className="bg-primary-700 enabled:hover:bg-primary-800"
                  onClick={handleEmptyDoc}
                >
                  Create an empty document
                </Button>
              </div>
            </div>
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
