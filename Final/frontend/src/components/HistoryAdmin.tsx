import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { Fragment, useState } from "react";
import { getCountry, getUser, getUsersWhoSearched } from "../services/history";
import { User } from "../types/userTypes";
import { Country, IHistory } from "../types/weatherTypes";
import ErrorHeading from "./Error";

const queryClient: QueryClient = new QueryClient();

export default function HistoryAdmin(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const Example = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>();
  const [countries, setCountries] = useState<Country[]>();
  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: AxiosError; data: IHistory[] } = useQuery({
    queryKey: ["history"],
    queryFn: async (): Promise<IHistory[]> => {
      const user = axios.get(`http://localhost:5000/users`, {
        withCredentials: true,
      });
      const countries = axios.get(`http://localhost:5000/weathers`);
      const response = axios.get(`http://localhost:5000/history/all`, {
        withCredentials: true,
      });
      const all = await Promise.all([user, countries, response]);
      const results = all.map((el) => el.data);
      setUsers(results[0].data.users);
      setCountries(results[1].countries);
      return results[2].countries;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

  return (
    <div className="history-admin">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <>
          <ErrorHeading error={error} />
        </>
      ) : (
        <>
          <h1>All History</h1>
          {data.map((country: IHistory, index: number) => (
            <Fragment key={index}>
              <div className="history-info">
                <img
                  src={getCountry(countries, country.rows[0]).flagUrl}
                  alt="Flag"
                />
                <ul>
                  <li>{`${
                    getCountry(countries, country.rows[0]).name
                  } has been searched: ${country.count} times.`}</li>
                  <li>{`Last time someone searched for this country: ${
                    getUser(users, country.rows[0]).email
                  } at ${country.rows[0].timestamp}`}</li>
                </ul>
              </div>
              <div className="history-queries-info">
                <p>{`Users who searched ${
                  getCountry(countries, country.rows[0]).name
                }:`}</p>
                <ol>
                  {getUsersWhoSearched(country.rows, users).map(
                    (user: User, index: number) => (
                      <Fragment key={index}>
                        <li>{`${user.name} <${user.email}>`}</li>
                      </Fragment>
                    )
                  )}
                </ol>
              </div>
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
};
