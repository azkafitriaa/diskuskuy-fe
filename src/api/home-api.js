import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";

export const fetchWeeksData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Week/`,
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

export const fetchWeekDataById = async (weekId) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Week/${weekId}/`,
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

export const createWeek = async (nameRequest) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/Week/`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${JSON.parse(getCookie("auth"))?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRequest,
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
    toast.error(error.message);
  }
};

export const fetchDosenData = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/auth/lecturers/`,
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
    toast.error(error.message)
  }
};

export const fetchThreadToday = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/thread-today/`,
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

export const fetchThreadThisMonth = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/forum/thread-this-month/`,
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
