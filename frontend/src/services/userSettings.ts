import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { User } from "../types/userTypes";
import { logout } from "./auth";
import catchError from "./catchError";

export const updateUser = async (name: string, bio: string): Promise<void> => {
  const data: User = await fetchUpdateUser(name, bio);
  if (data) {
    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
    window.localStorage.setItem("user", JSON.stringify(data));
  }
};

const fetchUpdateUser = async (name: string, bio: string): Promise<User> => {
  try {
    const response: AxiosResponse = await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}users/me`,
      { name, bio },
      { withCredentials: true }
    );
    toast.info("User updated.", {
      position: "bottom-left",
    });
    return response.data.data.user;
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const deleteMe = async (): Promise<void> => {
  await fetchDeleteMe();
};
const fetchDeleteMe = async (): Promise<void> => {
  try {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}users/me`, {
      withCredentials: true,
    });
    toast.info("User deleted.", {
      position: "bottom-left",
    });
    await logout();
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const promoteUser = async (id: number, role: string): Promise<void> => {
  await fetchPromotion(id, role);
  window.setTimeout(() => {
    window.location.reload();
  }, 1000);
};

const fetchPromotion = async (id: number, role: string): Promise<void> => {
  try {
    await axios.patch(
      `${process.env.REACT_APP_SERVER_URL}users/${id}`,
      { role },
      { withCredentials: true }
    );
    toast.info("User admin status changed.", {
      position: "bottom-left",
    });
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};

export const suspendUser = async (id: number): Promise<void> => {
  await fetchDelete(id);
  JSON.parse(window.localStorage.getItem("user")).id === id
    ? await logout()
    : window.setTimeout(() => {
        window.location.reload();
      }, 1000);
};

const fetchDelete = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}users/${id}`, {
      withCredentials: true,
    });
    toast.error("User deleted.", {
      position: "bottom-left",
    });
  } catch (error) {
    const typedError = error as AxiosError;
    catchError(typedError);
  }
};
