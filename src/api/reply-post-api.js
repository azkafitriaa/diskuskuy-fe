import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const replyPost = async (requestBody) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/post/replypost/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );
  
      if (!response.ok) {
        const responseError = await response.json();
        const message = `${responseError.errors.error_message}`;
        throw new Error(message);
      }
      // const responseData = await response.json();
      // return responseData;
    } catch (error) {
      toast.error(error.message)
    }
  };

  export const replyNestedPost = async (requestBody) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/post/nestedreplypost/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
            "Content-Type": "application/json",
          },
          
          body: requestBody,
        }
      );
  
      if (!response.ok) {
        const responseError = await response.json();
        const message = `${responseError.errors.error_message}`;
        throw new Error(message);
      }
      // const responseData = await response.json();
      // return responseData;
    } catch (error) {
      toast.error(error.message)
    }
  };
  