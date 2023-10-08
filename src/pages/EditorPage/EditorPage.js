import {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import PdfEditor from "../../components/PdfEditor/PdfEditor";
import HelloSignModal from "./HelloSignModal";
import { AnalysePdfModal } from "./AnalysePdfModal";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";
import { AuthContext } from "../../App";
import { OpenAiModal } from "./OpenAiModal";
import { FetchPdfById } from "../../components/Database/Queries";

const EditorContext = createContext({
  showHelloSignModal: false,
  setHelloSignModal: () => {},
  handlePdfAnalyse: () => {},
  editorUrls: null,
  setEditorUrls: () => {},
  openAiModal: false,
  setOpenAiModal: () => {},
  showAnalyseModal: false,
  setShowAnalyseModal: () => {},
  docDiffJSON: null,
  setDocDiffJSON: () => {},
  instance: null,
  document: null,
});

const EditorPage = () => {
  const [showHelloSignModal, setHelloSignModal] = useState(false);
  const [openAiModal, setOpenAiModal] = useState(false);
  const [showAnalyseModal, setShowAnalyseModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const instance = useRef(null);
  const navigate = useNavigate();
  const { document } = useParams();
  const { supabase } = useContext(AuthContext);
  const [editorUrls, setEditorUrls] = useState(null);

  const handlePdfAnalyse = useCallback(() => {
    // check in session storage for openai key, if found process with analyse modal
    // else show openai modal
    const openAiKey = sessionStorage.getItem("OPEN_AI_KEY");
    if (openAiKey === null || openAiKey === undefined || openAiKey === "") {
      setOpenAiModal(true);
    } else {
      setShowAnalyseModal(true);
    }
  }, []);

  useEffect(() => {
    if (document == null || document === undefined) {
      navigate("/error");
    }
    FetchPdfById({ supabase: supabase, pdf_id: document })
      .then((data) => {
        setEditorUrls({
          pdf_url: data.pdf_url,
          diff_obj: data.diff_obj,
          pdf_name: data.pdf_name,
          role: data.role,
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
            handlePdfAnalyse,
            openAiModal,
            setOpenAiModal,
            showAnalyseModal,
            setShowAnalyseModal,
            editorUrls,
            setEditorUrls,
            instance,
            document,
          }}
        >
          {showHelloSignModal && <HelloSignModal />}
          {openAiModal && <OpenAiModal />}
          <div className="flex flex-rows">
            {showAnalyseModal && <AnalysePdfModal />}
            <PdfEditor />
          </div>
        </EditorContext.Provider>
      )}
    </>
  );
};

export { EditorPage, EditorContext };
