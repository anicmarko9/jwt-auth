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
        <h1>Loading...</h1>
      ) : error ? (
        <>
          <ErrorHeading error={error} />
        </>
      ) : (
        <>
          <h1>History</h1>
          <table id="myTable">
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
                      <button onClick={() => deleteOneTimestamp(queryData.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
          <div className="total-search">
            <>
              <p>{`Total queries on this account: ${getSearchCount(data)}`}</p>

              <ul>
                {data.map((country: IHistory, index: number) =>
                  country.count > 0 ? (
                    <Fragment key={index}>
                      <li>{`You've searched ${
                        getCountry(countries, country.rows[0]).name
                      } ${country.count} times.`}</li>
                    </Fragment>
                  ) : (
                    <Fragment key={index}></Fragment>
                  )
                )}
              </ul>
            </>
          </div>
        </>
      )}
    </div>
  );
};
