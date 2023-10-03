import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const AuthNav = () => {
  const { supabase } = useContext(AuthContext);
  const [userObj, setUserObj] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userObj !== null) return;

    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (data?.session === null || error)
          throw new Error("No session found");

        console.log("AuthNav : ", data.session.user);
        const user = data.session.user;
        setUserObj({
          email: user.email,
          first_name: user.user_metadata.first_name,
          last_name: user.user_metadata.last_name,
          profile_img: user.user_metadata.profile_img,
        });
      })
      .catch((error) => {
        console.error("AuthNav : ", error);
      });
  }, [userObj, supabase]);

  const handleLogout = useCallback(() => {
    supabase.auth.signOut();
    navigate("/login");
  }, [navigate, supabase]);

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
              <Button className="mt-2" onClick={handleLogout}>
                Logout
              </Button>
            </Dropdown.Header>
          </Dropdown>
          <Navbar.Toggle />
        </div>
      </Navbar>
    </div>
  );
};

export { AuthNav };
