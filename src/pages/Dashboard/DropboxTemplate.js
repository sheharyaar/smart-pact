// Check for dropbox token, if not found show oauth modal

import { useState, useContext } from "react";
import { SignAuthContext } from "../../components/HelloSign/HelloSignAuth";

// else fetch the files and show them
const DropBoxTemplate = () => {
  const { signToken } = useContext(SignAuthContext);
  const [signTemplateLoading, setSignTemplateLoading] = useState(false);
  return <div>Hello Template : {signToken}</div>;
};

export default DropBoxTemplate;
