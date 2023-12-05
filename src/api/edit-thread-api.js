import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const editThread = async (threadId, requestBody) => {
  const headers = {
    Authorization: `Token ${JSON.parse(getCookie("auth"))?.token}`,
  };
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/thread/${threadId}/`,
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
