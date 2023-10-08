import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "../../App";
import { Navbar, Dropdown, Avatar, Button, Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { AiOutlineShareAlt } from "react-icons/ai";
import { buttonTheme } from "../FlowBiteStyles/Styles";

const AuthNavContext = createContext({
  isSaving: false,
  setIsSaving: () => {},
  isEditorPage: false,
  setIsEditorPage: () => {},
  authPdf: null,
  setAuthPdf: () => {},
});

const AuthNav = (props) => {
  const { supabase } = useContext(AuthContext);
  const [userObj, setUserObj] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorPage, setIsEditorPage] = useState(false);
  const [authPdf, setAuthPdf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userObj !== null) return;

    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (data?.session === null || error)
          throw new Error("No session found");

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
    <AuthNavContext.Provider
      value={{
        isSaving,
        setIsSaving,
        isEditorPage,
        setIsEditorPage,
        authPdf,
        setAuthPdf,
      }}
    >
      <div className="h-[8vh]">
        <Navbar fluid rounded>
          <Navbar.Brand
            href={`${process.env.REACT_APP_FRONTEND_URL}/dashboard`}
          >
            <img
              alt="Smart pact"
              className="mr-3 h-6 sm:h-9"
              src={`${process.env.PUBLIC_URL}/landify/new_logo.png`}
            />
          </Navbar.Brand>
          <div className="flex flex-row gap-3 md-order-2 items-center">
            {isEditorPage && authPdf && (
              <>
                <div>{authPdf?.name}</div>
                <div>
                  {authPdf?.role === "editor" ? (
                    <Badge color="warning">Editing</Badge>
                  ) : (
                    <Badge color="success">Viewing</Badge>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-4 md:order-3">
            {isEditorPage && (
              <Button size="xs" theme={buttonTheme}>
                <AiOutlineShareAlt className="mr-2 h-5 w-5" />
                <p>Share</p>
              </Button>
            )}
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="User settings"
                  img={userObj?.profile_img}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block font-bold text-lg">
                  {userObj?.first_name} {userObj?.last_name}
                </span>
                <span className="block truncate text-sm font-medium">
                  {userObj?.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={handleLogout}>
                <span className="text-purple-800">Sign out</span>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </Navbar>
      </div>
      <div>{props.children}</div>
    </AuthNavContext.Provider>
  );
};

export { AuthNav, AuthNavContext };
