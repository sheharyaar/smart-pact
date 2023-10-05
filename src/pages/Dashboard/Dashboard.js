import { createContext, useEffect } from "react";
import { Tabs } from "flowbite-react";
import { BiSolidUserCircle, BiSolidStar } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import { DashboardCardSection } from "./Card";
import { tabTheme } from "../../components/FlowBiteStyles/Styles";
import { useState, useContext } from "react";
import { AddPdfModal } from "./AddPdf";
import { AuthNav } from "../../components/AuthNav/AuthNav";
import { AuthContext } from "../../App";
import { FetchPdfList } from "../../components/Database/Queries";

const DashboardContext = createContext({});

const DashBoard = () => {
  const [pdfList, setPdfList] = useState([]);
  const [addPdfModal, setAddPdfModal] = useState(false);
  const [filteredList, setFilteredList] = useState(null);
  const { supabase } = useContext(AuthContext);
  // fetch user data if auth token is valid
  // and update the cards and tabs
  // TODO: SHEHAR: save to session storage too for caching
  useEffect(() => {
    FetchPdfList({
      supabase: supabase,
    })
      .then((data) => {
        const pdf_list = data?.pdf_list;
        if (pdf_list === undefined || pdf_list === null) {
          setFilteredList({
            starred: [],
            created: [],
            shared: [],
          });
        }

        const starred_pdfs = pdf_list.filter((pdf) => {
          return pdf.starred === true;
        });

        const created_list = pdf_list.filter((pdf) => {
          return pdf.pdf.created_by === pdf.user_id;
        });

        const shared_list = pdf_list.filter((pdf) => {
          return pdf.pdf.created_by !== pdf.user_id;
        });

        const list = {
          starred: starred_pdfs || [],
          created: created_list || [],
          shared: shared_list || [],
        };

        console.log("Dashboard : pdf_list", list);
        setFilteredList(list);
      })
      .catch((error) => {
        console.error("Dashboard :", error);
      });
  }, [supabase]);

  return (
    <DashboardContext.Provider
      value={{ pdfList, setPdfList, addPdfModal, setAddPdfModal }}
    >
      <AuthNav />
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
            cardList={filteredList?.created}
          />
        </Tabs.Item>
        <Tabs.Item title="Shared with me" icon={BsShareFill}>
          <DashboardCardSection
            isLoading={!filteredList}
            cardList={filteredList?.shared}
          />
        </Tabs.Item>
        <Tabs.Item title="Starred" icon={BiSolidStar}>
          <DashboardCardSection
            isLoading={!filteredList}
            cardList={filteredList?.starred}
          />
        </Tabs.Item>
      </Tabs.Group>
      {/* Add PDF modal */}
      {addPdfModal && <AddPdfModal />}
    </DashboardContext.Provider>
  );
};

export { DashBoard, DashboardContext };
