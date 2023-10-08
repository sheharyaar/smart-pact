import { createContext, useEffect, useCallback, useRef } from "react";
import { Tabs, Modal, Button, Spinner } from "flowbite-react";
import { BiSolidUserCircle } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { DashboardCardSection } from "./Card";
import { tabTheme } from "../../components/FlowBiteStyles/Styles";
import { useState, useContext } from "react";
import { AddPdfModal } from "./AddPdf";
import { AuthContext } from "../../App";
import { FetchPdfList, PdfDelete } from "../../components/Database/Queries";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { buttonTheme } from "../../components/FlowBiteStyles/Styles";

const DashboardContext = createContext({});

const DashBoard = () => {
  const [pdfList, setPdfList] = useState([]);
  const [addPdfModal, setAddPdfModal] = useState(false);
  const [filteredList, setFilteredList] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { supabase } = useContext(AuthContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const pdfDeleteRef = useRef(null);

  const pdfDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handlePdfDelete = useCallback(
    (e) => {
      setDeleting(false);
      if (pdfDeleteRef.current === null || pdfDeleteRef.current === undefined) {
        setShowDeleteModal(false);
      } else {
        setDeleting(true);
        PdfDelete({ supabase: supabase, pdf_id: pdfDeleteRef.current })
          .then((data) => {
            window.location.reload();
          })
          .catch((error) => {
            console.error("Dashboard : handlePdfDelete", error);
            setDeleting(false);
          });
      }
    },
    [supabase]
  );

  useEffect(() => {
    FetchPdfList({
      supabase: supabase,
    })
      .then((data) => {
        const pdf_list = data?.pdf_list;
        if (pdf_list === undefined || pdf_list === null) {
          setFilteredList({
            // starred: [],
            created: [],
            shared: [],
          });
        }

        // const starred_pdfs = pdf_list.filter((pdf) => {
        //   return pdf.starred === true;
        // });

        const created_list = pdf_list.filter((pdf) => {
          return pdf.pdf.created_by === pdf.user_id;
        });

        const shared_list = pdf_list.filter((pdf) => {
          return pdf.pdf.created_by !== pdf.user_id;
        });

        const list = {
          // starred: starred_pdfs || [],
          created: created_list || [],
          shared: shared_list || [],
        };

        setFilteredList(list);
      })
      .catch((error) => {
        console.error("Dashboard :", error);
      });
  }, [supabase]);

  return (
    <DashboardContext.Provider
      value={{
        pdfList,
        setPdfList,
        addPdfModal,
        setAddPdfModal,
        pdfDeleteModal,
        pdfDeleteRef,
      }}
    >
      {showDeleteModal && (
        <Modal
          show={showDeleteModal}
          size="md"
          popup
          onClose={() => setShowDeleteModal(false)}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-primary-400 dark:text-primary-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete the PDF?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  theme={buttonTheme}
                  isProcessing={deleting}
                  disabled={deleting}
                  processingSpinner={<Spinner className="fill-[#5e5ceb]" />}
                  onClick={handlePdfDelete}
                >
                  Yes, I'm sure
                </Button>
                <Button
                  theme={buttonTheme}
                  color="gray"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
      <Tabs.Group
        aria-label="Underlined tabs"
        // eslint-disable-next-line react/style-prop-object
        style="underline"
        theme={tabTheme}
      >
        <Tabs.Item active title="My documents" icon={BiSolidUserCircle}>
          <DashboardCardSection
            isLoading={!filteredList}
            showAddCard={true}
            editEnable={true}
            cardList={filteredList?.created}
            prefix="created"
          />
        </Tabs.Item>
        <Tabs.Item title="Shared with me" icon={BsShareFill}>
          <DashboardCardSection
            isLoading={!filteredList}
            editEnable={false}
            cardList={filteredList?.shared}
            prefix="shared"
          />
        </Tabs.Item>
      </Tabs.Group>
      {/* Add PDF modal */}
      {addPdfModal && <AddPdfModal />}
    </DashboardContext.Provider>
  );
};

export { DashBoard, DashboardContext };
