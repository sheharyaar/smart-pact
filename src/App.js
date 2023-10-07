import { createContext, useContext, useEffect, useState } from "react";
import { EditorPage } from "./pages/EditorPage/EditorPage";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { HelloSignOauthCb } from "./components/HelloSign/HelloSignOauthCb";
import { DashBoard } from "./pages/Dashboard/Dashboard";
import LoginPage from "./pages/LoginPage/LoginPage";
import { Spinner } from "flowbite-react";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { ToastContainer } from "react-toastify";

import { createClient } from "@supabase/supabase-js";

const AuthContext = createContext({
  supabase: null,
});

const ProtectedRoute = (props) => {
  const { supabase } = useContext(AuthContext);
  const [auth, setAuth] = useState({
    isAuthed: false,
    checkingAuth: true,
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        console.log("ProtectedRoute : ", data);
        if (data.session === null || data.session === undefined || error) {
          throw new Error("No session found");
        } else {
          setAuth({
            isAuthed: true,
            checkingAuth: false,
          });
        }
      })
      .catch((error) => {
        console.error("ProtectedRoute : ", error);
        setAuth({
          isAuthed: false,
          checkingAuth: false,
        });
      });
  }, [supabase]);

  return (
    <div>
      {auth.checkingAuth ? (
        <div className="w-100  text-center justify-center absolute top-1/2 left-1/2">
          <Spinner
            size="xl"
            className="fill-[#4d4dc7]"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
        <>
          {auth.isAuthed ? (
            <>
              <ToastContainer />
              {props.children}
            </>
          ) : (
            <Navigate to="/login" replace />
          )}
        </>
      )}
    </div>
  );
};

function App() {
  const supabase_url = "https://dijwhvtevpfjabedbszq.supabase.co";
  const anon_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpandodnRldnBmamFiZWRic3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5ODk4MTEsImV4cCI6MjAxMTU2NTgxMX0.JHlNWYoHAJa1rLEsiXiILl3d287yjSKToPpF2SvQEJc";
  const supabase = createClient(supabase_url, anon_key);
  if (supabase === null || supabase === undefined) {
    console.error("Supabase client is null");
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          supabase,
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage login={true} />} />
          <Route path="/signup" element={<LoginPage login={false} />} />
          <Route
            path="/editor/:document"
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
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export { App, AuthContext };
