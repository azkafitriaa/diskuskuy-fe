import axios from "axios";
import firebase from "@/utils/firebase";
import { toast } from "react-hot-toast";
import { getCookie } from "cookies-next";

export const createThread = async (requestBody) => {
  const headers = {
    Authorization: `Token ${JSON.parse(getCookie("auth"))?.token}`,
  };
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Thread/`,
      requestBody,
      {
        headers: headers,
      }
    );

    const responseData = response;
    return responseData;
  } catch (error) {
    toast.error(error.message)
  }
};

export const createReferenceFile = async (file, threadId) => {
  const upload = firebase?.storage()?.ref(`/reference_file/${threadId}/`)?.child(file?.name)?.put(file);

  upload.then((res) => {
    upload.snapshot.ref.getDownloadURL().then((url) => {
      const requestBody = {
        title: res?._delegate.metadata.name,
        url: url,
        thread: threadId,
      };
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BE_URL}/forum/ReferenceFile/`,
          requestBody,
          {
            headers: {
              Authorization: `Token ${JSON.parse(getCookie("auth"))?.token}`,
            },
          }
        )
        .then(() => {
          setTimeout(() => {
            window.location.href = `/forum/${threadId}`;
            // router.push(`/forum/${threadId}`);
          }, 10000);
        })
        .catch((error) => {
          toast.error(error.message)
        });
    });
  });
};

export const fetchAllGroup = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/auth/group`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${JSON.parse(getCookie("auth"))?.token}`,
        },
      }
    );

    if (!response.ok) {
      const responseError = await response.json();
      const message = `${responseError.errors.error_message}`;
      throw new Error(message);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    toast.error(error.message);
  }
};