import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { FetchUserDetails } from "../Database/Queries";
import { Navbar, Dropdown, Avatar } from "flowbite-react";

const AuthNav = () => {
  const { appAuthToken } = useContext(AuthContext);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    if (!appAuthToken) return;
    if (userObj) return;

    FetchUserDetails({
      token: appAuthToken,
      email: "shehar@gmail.com",
    })
      .then((data) => {
        console.log("AuthNav : ", data);
        setUserObj({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_img: data.profile_img,
        });
      })
      .catch((error) => {
        console.error("AuthNav : ", error);
        throw error;
      });
  }, [appAuthToken, userObj]);

  return (
    <div className="h-[8vh]">
      <Navbar fluid rounded>
        <Navbar.Brand href="http://localhost:3000/">
          <img
            alt="Smart pact"
            className="mr-3 h-6 sm:h-9"
            src={`${process.env.PUBLIC_URL}/logo.svg`}
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Smart Pact
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="User settings" img={userObj?.profile_img} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{userObj?.first_name}</span>
              <span className="block truncate text-sm font-medium">
                {userObj?.email}
              </span>
            </Dropdown.Header>
          </Dropdown>
          <Navbar.Toggle />
        </div>
      </Navbar>
    </div>
  );
};

export { AuthNav };
