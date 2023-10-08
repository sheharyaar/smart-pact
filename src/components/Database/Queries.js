const FetchPdfList = (props) => {
  return new Promise(async (resolve, reject) => {
    const { data, error } = await props.supabase.auth.getSession();
    if (error) throw error;

    const userOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: data.session.user.id,
      }),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/userPdfList`,
        userOptions
      );

      if (response.status >= 200 && response.status < 300) {
        const data = await response.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${response.status}`));
      }
    } catch (error) {
      console.error("FetchPdfList : ", error);
      reject(error);
    }
  });
};

// requires pdf_id, user_id (to check role)
const FetchPdfById = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await props.supabase.auth.getSession();
      if (data.error) throw data.error;

      const user_id = data.data.session.user.id;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          pdf_id: props.pdf_id,
        }),
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/fetchPdf`,
        options
      );
      if (resp.status >= 200 && resp.status < 300) {
        const data = await resp.json();
        let pdfDiff = JSON.parse(data.diff_json);
        if (pdfDiff === null || pdfDiff === undefined) {
          console.error("FetchPdfById : error parsing diff json");
          pdfDiff = null;
        }

        resolve({
          pdf_url: data.pdf_url,
          diff_obj: pdfDiff,
          pdf_name: data.pdf_name,
          role: data.role,
        });
        resolve(data);
      } else {
        throw new Error(`HTTP Error ${resp.status}`);
      }
    } catch (e) {
      console.error("FetchPdfById : ", e);
      reject(e);
    }
  });
};

const CreateEmptyDoc = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.session.user.id,
          pdf_name: props.document_title,
        }),
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/createEmptyPdf`,
        options
      );

      if (resp.status >= 200 && resp.status < 300) {
        const data = await resp.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${resp.status}`));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

const CreateUploadDoc = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      props.formData.append("user_id", data.session.user.id);

      const options = {
        method: "POST",
        body: props.formData,
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/createUploadPdf`,
        options
      );

      if (resp.status >= 200 && resp.status < 300) {
        const data = await resp.json();
        resolve(data);
      } else {
        reject(new Error(`HTTP Error ${resp.status}`));
      }
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

const PdfDelete = (props) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data, error } = await props.supabase.auth.getSession();
      if (error) throw error;

      const user_id = data.session.user.id;
      const pdf_id = props.pdf_id;

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user_id, pdf_id: pdf_id }),
      };

      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/deletePdf`,
        options
      );
      if (resp.status >= 200 && resp.status < 300) {
        await resp.json();
        resolve("success");
      } else {
        reject(new Error(`HTTP Error ${resp.status}`));
      }
    } catch (e) {
      console.error("PdfDelete : error deleting pdf", e);
      reject(e);
    }
  });
};

export {
  FetchPdfList,
  CreateEmptyDoc,
  CreateUploadDoc,
  FetchPdfById,
  PdfDelete,
};
