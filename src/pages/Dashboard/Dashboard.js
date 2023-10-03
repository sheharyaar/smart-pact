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
  const { authToken } = useContext(AuthContext);
  // fetch user data if auth token is valid
  // and update the cards and tabs
  // TODO: save to session storage too for caching
  useEffect(() => {
    if (!authToken) return;

    FetchPdfList({
      token: authToken,
      email: "shehar@gmail.com",
    })
      .then((data) => {
        console.log("Dashboard :", data);
      })
      .catch((error) => {
        console.error("Dashboard :", error);
      });
  }, [authToken]);

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
          <DashboardCardSection showAddCard={true} cardList={pdfList} />
        </Tabs.Item>
        <Tabs.Item title="Shared with me" icon={BsShareFill}>
          <DashboardCardSection cardList={null} />
        </Tabs.Item>
        <Tabs.Item title="Starred" icon={BiSolidStar}>
          <DashboardCardSection cardList={null} />
        </Tabs.Item>
      </Tabs.Group>
      {/* Add PDF modal */}
      {addPdfModal && <AddPdfModal />}
    </DashboardContext.Provider>
  );
};

export { DashBoard, DashboardContext };
