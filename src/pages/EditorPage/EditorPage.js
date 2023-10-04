import { createContext, useState, useRef, useEffect } from "react";
import PdfEditor from "../../components/PdfEditor/PdfEditor";
import HelloSignModal from "./HelloSignModal";
import GeneratePdfModal from "./GeneratePdfModal";
import { AuthNav } from "../../components/AuthNav/AuthNav";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";

const EditorContext = createContext({});

const EditorPage = () => {
  const [showHelloSignModal, setHelloSignModal] = useState(false);
  const [showGeneratePdfModal, setGeneratePdfModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const instance = useRef(null);
  const navigate = useNavigate();
  const { document } = useParams();

  useEffect(() => {
    console.log(document);
    if (document == null || document === undefined) {
      navigate("/error");
    }

    // TODO: SHEHAR: Check if the document provided is valid and belongs to the user
    // Then download the pdf and save to session storage for this
    // Read the editor from session storage and load it
    setIsEditable(true);
  }, [navigate, document]);

  return (
    <>
      {!isEditable ? (
        <div className="text-center">
          <Spinner
            size="xl"
            className="fill-[#4d4dc7] justify-self-center"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
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
      )}
    </>
  );
};

export { EditorPage, EditorContext };
