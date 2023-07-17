import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const fetchThreadDataById = async (threadId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Thread/` + threadId,
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

export const fetchReplyDataById = async (threadId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/post/initialpost/` + threadId,
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

export const fetchSummary = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/forum/Summary`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
      }
    });

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



export const updateSummaryById = async (id, requestBody) => {
  const headers = {
    "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
  }
  axios
    .put(`${process.env.NEXT_PUBLIC_BE_URL}/forum/Summary/${id}/`, requestBody, {
      headers : headers
    })
    .then((response) => {
      if (response) {
        toast.success("Berhasil menambahkan ringkasan diskusi")
        window.location.reload()
      };
    })
    .catch((error) => {
      toast.error(error.message)
    });
};

export const createSummary = async (requestBody) => {
  const headers = {
    "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
  }
  axios
    .post(`${process.env.NEXT_PUBLIC_BE_URL}/forum/Summary/`, requestBody, {
      headers : headers
    })
    .then((response) => {
      if (response) {
        toast.success("Berhasil menyimpan ringkasan diskusi")
        window.location.reload()
      };
    })
    .catch((error) => {
      toast.error(error.message)
    });
};

export const fetchNestedReply = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/post/nestedreplypost/`,
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

export const fetchReferences = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/forum/ReferenceFile`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
      }
    });

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

export const addOrRemoveLikePost = async (postId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/post/like/${postId}/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
          "Content-Type": "application/json",
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
    toast.error(error.message)
  }
};

export const addOrRemoveClapPost = async (postId) => {
  try {
    const response = await fetch(
        // TODO: ganti
      `${process.env.NEXT_PUBLIC_BE_URL}/post/clap/${postId}/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
          "Content-Type": "application/json",
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
    toast.error(error.message)
  }
};

export const addOrRemoveLovePost = async (postId) => {
  try {
    const response = await fetch(
        // TODO: ganti
      `${process.env.NEXT_PUBLIC_BE_URL}/post/love/${postId}/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
          "Content-Type": "application/json",
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
    toast.error(error.message)
  }
};

export const fetchAnalytics = async (threadId) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/forum/analytics/${threadId}` , {
      method: "GET",
      headers: {
        "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
      }
    });

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

// export const fetchShowOnboardingData = async (threadId, state) => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BE_URL}/forum/onboarding?threadId=${threadId}&state=${state}`,
//       {
//         method: "GET",
//         headers: {
//           "Authorization": `Token ${JSON.parse(getCookie("auth"))?.token}`,
//         }
//       }
//     );

//     if (!response.ok) {
//       const responseError = await response.json();
//       const message = `${responseError.errors.error_message}`;
//       throw new Error(message);
//     }
//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     // toast.error(error.message)
//   }
// };
export const fetchBreadcrumbByThreadId = async (threadId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Breadcrumb/` + threadId,
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
