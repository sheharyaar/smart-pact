import { Card, Spinner, ListGroup } from "flowbite-react";
import {
  cardTheme,
  listGroupTheme,
} from "../../components/FlowBiteStyles/Styles";
import { AiOutlinePlus } from "react-icons/ai";
import { CiImageOff } from "react-icons/ci";
import { DashboardContext } from "./Dashboard";
import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const DashboardCard = (props) => {
  const { pdfDeleteModal, pdfDeleteRef } = useContext(DashboardContext);

  const handlePdfDelete = useCallback(
    (e) => {
      e.stopPropagation();
      pdfDeleteRef.current = props.id;
      pdfDeleteModal();
    },
    [pdfDeleteModal, pdfDeleteRef, props.id]
  );

  return (
    <Card
      key={props.id}
      theme={cardTheme}
      onClick={props.onClick}
      className="group relative"
    >
      {props.editEnable && (
        <div className=" absolute top-[5px] right-[5px] z-40 group-hover:visible invisible">
          <ListGroup theme={listGroupTheme}>
            <ListGroup.Item
              theme={listGroupTheme.item}
              onClick={handlePdfDelete}
            >
              <MdDeleteOutline className="fill-white" />
            </ListGroup.Item>
          </ListGroup>
        </div>
      )}
      {/* Image addition to card : if not string then rernder the element */}
      <div className="basis-4/5 flex flex-cols items-center border-b-2">
        {props.imgSrc &&
          (typeof props.imgSrc === "string" ? (
            <img
              src={props.imgSrc}
              alt="card icon"
              className="w-[200px] h-[250px] "
            />
          ) : (
            <props.imgSrc className="w-1/3 h-1/3 mx-auto text-[#4d4dc7]" />
          ))}
      </div>
      {props.body && (
        <div className="mt-[5px] basis-1/5">
          <p className="font-normal text-gray-700 dark:text-gray-400 break-words">
            {props.body}
          </p>
        </div>
      )}
    </Card>
  );
};

const DashboardCardSection = (props) => {
  const { setAddPdfModal } = useContext(DashboardContext);
  const navigate = useNavigate();
  return (
    <>
      {props.isLoading ? (
        <div className="text-center">
          <Spinner
            size="xl"
            className="fill-primary-700 justify-self-center"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
        <div className="grid grid-cols-fill justify-items-center gap-x-[15px] gap-y-[25px] m-[20px]">
          {props.showAddCard && (
            <DashboardCard
              id={"add-card"}
              imgSrc={AiOutlinePlus}
              body={"Add a new document"}
              editEnable={false}
              onClick={() => {
                setAddPdfModal(true);
              }}
            />
          )}
          {props.cardList &&
            props.cardList.length > 0 &&
            props.cardList.map((card) => (
              <DashboardCard
                key={props.prefix + card.pdf_id}
                imgSrc={
                  props?.pdf?.pdf_tumbnail ? props.pdf.pdf_tumbnail : CiImageOff
                }
                id={card.pdf_id}
                body={card.pdf.pdf_name}
                editEnable={props.editEnable}
                onClick={() => {
                  navigate(`/editor/${card.pdf_id}`);
                }}
              />
            ))}
        </div>
      )}
    </>
  );
};

export { DashboardCard, DashboardCardSection };
