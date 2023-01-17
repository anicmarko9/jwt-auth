import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { Fragment, useState } from "react";
import {
  clearAll,
  deleteOneTimestamp,
  getCountry,
  getSearchCount,
  sortHistory,
} from "../services/history";
import { Country, IHistory, IQuery } from "../types/weatherTypes";
import ErrorHeading from "./Error";

const queryClient: QueryClient = new QueryClient();

export default function History(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const Example = (): JSX.Element => {
  const [countries, setCountries] = useState<Country[]>();
  const [history, setHistory] = useState<IQuery[]>();
  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: AxiosError; data: IHistory[] } = useQuery({
    queryKey: ["history"],
    queryFn: async (): Promise<IHistory[]> => {
      const countriesPromise = axios.get(`http://localhost:5000/weathers`);
      const historyPromise = axios.get(`http://localhost:5000/history/me`, {
        withCredentials: true,
      });
      const all: AxiosResponse[] = await Promise.all([
        countriesPromise,
        historyPromise,
      ]);
      const results = all.map((el: AxiosResponse) => el.data);
      setCountries(results[0].countries);
      setHistory(sortHistory(results[1].countries));
      return results[1].countries;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

  return (
    <div className="history-container">
      {isLoading ? (
        <h1 className="country-container">Loading...</h1>
      ) : error ? (
        <>
          <ErrorHeading error={error} />
        </>
      ) : (
        <div className="table">
          <h1 className="center">History</h1>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Query</th>
                <th>
                  <button onClick={clearAll}>Clear All</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((queryData: IQuery, index: number) => (
                <Fragment key={index}>
                  <tr>
                    <td>{queryData.timestamp}</td>
                    <td>{`${getCountry(countries, queryData).name} [${
                      getCountry(countries, queryData).capitalCity
                    }] <${queryData.query}>`}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => deleteOneTimestamp(queryData.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <div className="total-search">
            <>
              <p>
                Total queries on this account:{" "}
                <span className="variable">{getSearchCount(data)}</span>
              </p>
              <ul>
                {data.map((country: IHistory, index: number) =>
                  country.count > 0 ? (
                    <Fragment key={index}>
                      <li>
                        You've searched{" "}
                        <span className="variable country-name">
                          {getCountry(countries, country.rows[0]).name}
                        </span>{" "}
                        <span className="variable">{country.count}</span> times.
                      </li>
                    </Fragment>
                  ) : (
                    <Fragment key={index}></Fragment>
                  )
                )}
              </ul>
            </>
          </div>
        </div>
      )}
    </div>
  );
};
