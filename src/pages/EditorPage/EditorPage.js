import { createContext, useState, useRef, useEffect, useContext } from "react";
import PdfEditor from "../../components/PdfEditor/PdfEditor";
import HelloSignModal from "./HelloSignModal";
import { AnalysePdfModal } from "./AnalysePdfModal";
import { AuthNav } from "../../components/AuthNav/AuthNav";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { AuthContext } from "../../App";
import { FetchPdfById } from "../../components/Database/Queries";

const EditorContext = createContext({
  showHelloSignModal: false,
  setHelloSignModal: () => {},
  analysePdfModal: false,
  setAnalysePdfModal: () => {},
  editorUrls: null,
  setEditorUrls: () => {},
  docDiffJSON: null,
  setDocDiffJSON: () => {},
  instance: null,
  document: null,
});

const EditorPage = () => {
  const [showHelloSignModal, setHelloSignModal] = useState(false);
  const [analysePdfModal, setAnalysePdfModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const instance = useRef(null);
  const navigate = useNavigate();
  const { document } = useParams();
  const { supabase } = useContext(AuthContext);
  const [editorUrls, setEditorUrls] = useState(null);

  useEffect(() => {
    if (document == null || document === undefined) {
      navigate("/error");
    }
    FetchPdfById({ supabase: supabase, pdf_id: document })
      .then((data) => {
        console.log("Editor page :", data);

        setEditorUrls({
          pdf_url: data.pdf_url,
          diff_obj: data.diff_obj,
          pdf_name: data.pdf_name,
        });
        setIsEditable(true);
      })
      .catch((e) => {
        console.error(e);
        navigate("/error");
      });
  }, [navigate, document, supabase]);

  return (
    <>
      {!isEditable ? (
        <div className="w-100  text-center justify-center absolute top-1/2 left-1/2">
          <Spinner
            size="xl"
            aria-label="Center-aligned"
            className="fill-[#4d4dc7]"
          />
        </div>
      ) : (
        <EditorContext.Provider
          value={{
            showHelloSignModal,
            setHelloSignModal,
            analysePdfModal,
            setAnalysePdfModal,
            editorUrls,
            setEditorUrls,
            instance,
            document,
          }}
        >
          <AuthNav />
          {showHelloSignModal && <HelloSignModal />}
          <div>
            {analysePdfModal && <AnalysePdfModal />}
            <PdfEditor />
          </div>
        </EditorContext.Provider>
      )}
    </>
  );
};

export { EditorPage, EditorContext };
