import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const fetchDiscussionGuideDataByThreadId = async () => {
  try {
    const path = location.pathname;
    const pathArray = path.split("/");
    const threadId = pathArray[pathArray.length - 2];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/${threadId}/discussion-guide/`,
      {
        method: "GET",
        headers: {
          "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`, 
        }
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
    toast.error(error.message)
  }
};

export const updateThreadStateById = async (id, stateRequest) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/thread/${id}/`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          state: stateRequest,
        }),
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
    toast.error(error.message)
  }
};
