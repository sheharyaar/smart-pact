import { createContext, useContext, useEffect, useState } from "react";
import { EditorPage } from "./pages/EditorPage/EditorPage";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { HelloSignOauthCb } from "./components/HelloSign/HelloSignOauthCb";
import { DashBoard } from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import { Spinner } from "flowbite-react";

const AuthContext = createContext({
  appAuthToken: null,
  setAppAuthToken: () => {},
  signAuthToken: null,
  setSignAuthToken: () => {},
});

const ProtectedRoute = (props) => {
  let { appAuthToken } = useContext(AuthContext);

  if (
    appAuthToken === "" ||
    appAuthToken === null ||
    appAuthToken === undefined
  ) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{props.children}</>;
};

function App() {
  const [appAuthToken, setAppAuthToken] = useState(null);
  const [signAuthToken, setSignAuthToken] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // initialise auth token
  useEffect(() => {
    const token = sessionStorage.getItem("DROPBOX_SIGN_OAUTH_ID");
    if (token === "" || token === null || token === undefined) {
      setSignAuthToken(null);
    } else {
      setSignAuthToken(token);
    }

    const appToken = sessionStorage.getItem("SMART_PACT_AUTH_ID");
    if (appToken === "" || appToken === null || appToken === undefined) {
      setAppAuthToken(null);
    } else {
      setAppAuthToken(appToken);
    }

    setAuthChecking(false);
  }, []);

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          appAuthToken,
          setAppAuthToken,
          signAuthToken,
          setSignAuthToken,
        }}
      >
        {authChecking ? (
          <div className="w-100  text-center justify-center absolute top-1/2 left-1/2">
            <Spinner
              size="xl"
              className="fill-[#4d4dc7]"
              aria-label="Center-aligned"
            />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <EditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hellosign/oauthCallback"
              element={<HelloSignOauthCb />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export { App, AuthContext };
