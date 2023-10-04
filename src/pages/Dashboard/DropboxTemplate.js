// Check for dropbox token, if not found show oauth modal
import { Spinner, Card } from "flowbite-react";
import { useState, useContext, useEffect } from "react";
import { SignAuthContext } from "../../components/HelloSign/HelloSignAuth";
import { FetchTemplates } from "../../components/HelloSign/HelloSignUtils";
import { listCardTheme } from "../../components/FlowBiteStyles/Styles";

// else fetch the files and show them
const DropBoxTemplate = () => {
  const { signToken } = useContext(SignAuthContext);
  const [signTemplateLoading, setSignTemplateLoading] = useState(true);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    FetchTemplates({ token: signToken, page: 1 })
      .then((data) => {
        console.log("DropBoxTemplate : ", data);
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
                      key={index}
                      theme={listCardTheme}
                      onClick={() => {
                        console.log("clicked");
                      }}
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
