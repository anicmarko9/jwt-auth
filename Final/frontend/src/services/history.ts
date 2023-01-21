import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { User } from "../types/userTypes";
import { Country, IHistory, IQuery } from "../types/weatherTypes";
import catchError from "./catchError";

export const getSearchCount = (data: IHistory[]): number => {
  let queries: number = 0;
  data.forEach((country: IHistory) => {
    queries += country.count;
  });
  return queries;
};

export const getCountry = (countries: Country[], row: IQuery): Country => {
  return countries.find((country: Country) => country.id === row.countryId);
};
export const getUser = (users: User[], row: IQuery): User => {
  return users.find((user: User) => user.id === row.userId);
};

export const getUsersWhoSearched = (rows: IQuery[], users: User[]): User[] => {
  const idArray: number[] = [];
  const userArray: User[] = [];
  rows.map((row: IQuery) => idArray.push(row.userId));
  const uniqueUsers: number[] = [...new Set(idArray)];
  uniqueUsers.forEach((id: number) => {
    userArray.push(users.find((user: User) => user.id === id));
  });
  return userArray;
};

export const sortHistory = (input: IHistory[]): IQuery[] => {
  const sortedArray: IQuery[] = [];
  input.forEach((country: IHistory) => {
    country.rows.forEach((historyData: IQuery) => {
      sortedArray.push(historyData);
    });
  });
  sortedArray.sort((a: IQuery, b: IQuery) => {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  });
  return sortedArray;
};

export const clearAll = async (): Promise<void> => {
  try {
    await axios.delete(`http://localhost:5000/history/me`, {
      withCredentials: true,
    });
    toast.info("History deleted.", {
      position: "bottom-left",
    });
    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    const typedError = err as AxiosError;
    catchError(typedError);
  }
};

export const deleteOneTimestamp = async (id: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:5000/history/me/${id}`, {
      withCredentials: true,
    });
    toast.info("Query deleted.", {
      position: "bottom-left",
    });
    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    const typedError = err as AxiosError;
    catchError(typedError);
  }
};

export const checkData = (data: IHistory[]): boolean => {
  const array: IHistory[] = [];
  data.forEach((country: IHistory) => {
    if (country.rows.length > 0) return array.push(country);
    else return array.push(null);
  });

  const value: boolean = array.every((element: IHistory) => element === null);
  console.log(data);
  return value;
};
