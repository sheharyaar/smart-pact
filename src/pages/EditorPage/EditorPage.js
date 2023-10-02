import { createContext, useState, useRef } from "react";
import PdfEditor from "../../components/PdfEditor/PdfEditor";
import HelloSignModal from "./HelloSignModal";
import GeneratePdfModal from "./GeneratePdfModal";
import { AuthNav } from "../../components/AuthNav/AuthNav";

const EditorContext = createContext({});

const EditorPage = () => {
  const emptyDoc = `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}/pdf-pages/empty.pdf`;

  const [showHelloSignModal, setHelloSignModal] = useState(false);
  const [showGeneratePdfModal, setGeneratePdfModal] = useState(false);
  const instance = useRef(null);

  const document = emptyDoc;
  return (
    <EditorContext.Provider
      value={{
        showHelloSignModal,
        setHelloSignModal,
        showGeneratePdfModal,
        setGeneratePdfModal,
        document,
        instance,
      }}
    >
      <AuthNav />
      <PdfEditor />
      {showHelloSignModal && <HelloSignModal />}
      {showGeneratePdfModal && <GeneratePdfModal />}
    </EditorContext.Provider>
  );
};

export { EditorPage, EditorContext };
