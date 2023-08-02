import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { Fragment, useState } from "react";
import {
  checkData,
  getCountry,
  getUser,
  getUsersWhoSearched,
} from "../services/history";
import { User } from "../types/userTypes";
import { Country, IHistory } from "../types/weatherTypes";
import ErrorHeading from "./Error";
import LoadingPage from "./LoadingPage";

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
    queryKey: ["history-admin"],
    queryFn: async (): Promise<IHistory[]> => {
      const user = axios.get(`${process.env.REACT_APP_SERVER_URL}users`, {
        withCredentials: true,
      });
      const countries = axios.get(
        `${process.env.REACT_APP_SERVER_URL}weathers`
      );
      const response = axios.get(
        `${process.env.REACT_APP_SERVER_URL}history/all`,
        {
          withCredentials: true,
        }
      );
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
        <LoadingPage />
      ) : error ? (
        <>
          <ErrorHeading error={error} />
        </>
      ) : (
        <>
          <h1 className="center">All History</h1>
          {!checkData(data) ? (
            data.map((country: IHistory, index: number) =>
              country.rows.length > 0 ? (
                <Fragment key={index}>
                  <div className="history-info">
                    <div className="flag-query">
                      <img
                        src={getCountry(countries, country.rows[0]).flagUrl}
                        alt="Flag"
                      />
                      <ul>
                        <p>
                          {getCountry(countries, country.rows[0]).name} has been
                          searched:{" "}
                          <span className="variable country-name">
                            {country.count}
                          </span>{" "}
                          times.
                        </p>
                        <li>
                          Last time someone searched for this country:
                          <p>
                            <span className="variable country-name">
                              {getUser(users, country.rows[0]).email}
                            </span>{" "}
                            at{" "}
                            <span className="variable country-name">
                              {country.rows[0].timestamp}
                            </span>
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="history-queries-info">
                      <p className="text-title">{`Users who searched ${
                        getCountry(countries, country.rows[0]).name
                      }:`}</p>
                      <ol>
                        {getUsersWhoSearched(country.rows, users).map(
                          (user: User, index: number) => (
                            <Fragment key={index}>
                              <li>
                                {user.name}{" "}
                                <span className="variable country-name">
                                  {`<${user.email}>`}
                                </span>
                              </li>
                            </Fragment>
                          )
                        )}
                      </ol>
                    </div>
                  </div>
                </Fragment>
              ) : (
                <Fragment key={index}></Fragment>
              )
            )
          ) : (
            <h2 className="center no-data">Nothing has been searched yet!</h2>
          )}
        </>
      )}
    </div>
  );
};
