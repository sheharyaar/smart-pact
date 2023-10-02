import { Card } from "flowbite-react";
import { cardTheme } from "../../components/FlowBiteStyles/Styles";
import { AiOutlinePlus } from "react-icons/ai";
import { DashboardContext } from "./Dashboard";
import { useContext } from "react";

const DashboardCard = (props) => {
  return (
    <Card theme={cardTheme} onClick={props.onClick}>
      {/* Image addition to card : if not string then rernder the element */}
      {props.imgSrc &&
        (typeof props.imgSrc === "string" ? (
          <img
            src={props.imgSrc}
            alt="card icon"
            className="w-[100px] h-[100px] mx-auto "
          />
        ) : (
          <props.imgSrc className="w-1/4 h-1/4 mx-auto text-[#4d4dc7]" />
        ))}

      {/* Title for card */}
      {props.title && (
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {props.title}
        </h2>
      )}

      {/* Body for card*/}
      {props.body && (
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {props.body}
        </p>
      )}
    </Card>
  );
};

const DashboardCardSection = (props) => {
  const { setAddPdfModal } = useContext(DashboardContext);
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px] m-[20px]">
      {props.showAddCard && (
        <DashboardCard
          imgSrc={AiOutlinePlus}
          onClick={() => {
            setAddPdfModal(true);
          }}
        />
      )}
      {props.cardList &&
        props.cardList.length > 0 &&
        props.cardList.map((card) => (
          <DashboardCard title={card.title} body={card.body} />
        ))}
    </div>
  );
};

export { DashboardCard, DashboardCardSection };
