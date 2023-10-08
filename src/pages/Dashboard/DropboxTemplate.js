// Check for dropbox token, if not found show oauth modal
import { Spinner, Card } from "flowbite-react";
import { useState, useContext, useEffect, useCallback } from "react";
import { SignAuthContext } from "../../components/HelloSign/HelloSignAuth";
import { FetchTemplates } from "../../components/HelloSign/HelloSignUtils";
import { listCardTheme } from "../../components/FlowBiteStyles/Styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";

const CreateFromTemplate = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      const user_id = data.session.user;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: props.token,
          user_id: user_id.id,
          template_id: props.template_id,
          template_name: props.template_title,
        }),
      };
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/helloSign/createFromTemplate`,
        options
      );

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      reject(error);
    }
  });
};

// else fetch the files and show them
const DropBoxTemplate = () => {
  const { signToken } = useContext(SignAuthContext);
  const { supabase } = useContext(AuthContext);

  const [signTemplateLoading, setSignTemplateLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  const handleTemplateClick = useCallback(
    (e) => {
      setSignTemplateLoading(true);
      const template_id = e.currentTarget.id;
      const template = templates.find(
        (template) => template.template_id === template_id
      );

      if (!template) throw new Error("Template not found");
      CreateFromTemplate({
        supabase: supabase,
        token: signToken,
        template_id: template.template_id,
        template_title: template.title,
      })
        .then(() => {
          navigate(`/editor/${template.template_id}`);
        })
        .catch((error) => {
          console.error("DropBoxTemplate : ", error);
          // TODO: Handle with an error element or alert
        });

      setSignTemplateLoading(false);
    },
    [templates, navigate, signToken, supabase]
  );

  useEffect(() => {
    FetchTemplates({ token: signToken, page: 1 })
      .then((data) => {
        if (data.templates.length > 0) {
          if (templates.length > 0) {
            setTemplates([...templates, ...data.templates]);
          } else {
            setTemplates(data.templates);
          }
        }
        setSignTemplateLoading(false);
      })
      .catch((error) => {
        console.error("DropBoxTemplate : ", error);
        setSignTemplateLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signToken]);

  return (
    <div>
      {signTemplateLoading ? (
        <div className="text-center">
          <Spinner
            size="xl"
            className="fill-primary-700 justify-self-center"
            aria-label="Center-aligned"
          />
        </div>
      ) : (
        <div>
          {templates.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template, index) => {
                  return (
                    <Card
                      id={template.template_id}
                      key={index}
                      theme={listCardTheme}
                      onClick={handleTemplateClick}
                    >
                      <p className="font-normal text-gray-700 dark:text-gray-400">
                        {template.title}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center">
              No dropbox templates found.
              <br />
              You can create a template on Dropbox Sign webpage
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropBoxTemplate;
