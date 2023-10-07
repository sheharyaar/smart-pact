import { Card, Spinner } from "flowbite-react";
import { cardTheme } from "../../components/FlowBiteStyles/Styles";
import { AiOutlinePlus } from "react-icons/ai";
import { CiImageOff } from "react-icons/ci";
import { DashboardContext } from "./Dashboard";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = (props) => {
  return (
    <Card key={props.id} theme={cardTheme} onClick={props.onClick}>
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
      {/* Body for card*/}
      {props.body && (
        <div className="mt-[5px] basis-1/5">
          <p className="font-normal text-gray-700 dark:text-gray-400">
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
              onClick={() => {
                setAddPdfModal(true);
              }}
            />
          )}
          {props.cardList &&
            props.cardList.length > 0 &&
            props.cardList.map((card) => (
              <DashboardCard
                imgSrc={
                  props?.pdf?.pdf_tumbnail ? props.pdf.pdf_tumbnail : CiImageOff
                }
                id={card.pdf_id}
                body={card.pdf.pdf_name}
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
