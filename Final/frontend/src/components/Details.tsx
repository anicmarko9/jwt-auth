import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React, { Fragment } from "react";
import { useParams } from "react-router-dom";
import axios, { AxiosError, AxiosResponse } from "axios";
import Results from "./Results";
import { checkCity } from "../services/service";

//ovde
const queryClient: QueryClient = new QueryClient();

export default function Details(): JSX.Element {
  const { countryCode } = useParams<string>();
  return (
    <QueryClientProvider client={queryClient}>
      <Example countryCode={countryCode} />
    </QueryClientProvider>
  );
}

function Example({ countryCode }): JSX.Element {
  const {
    isLoading,
    error,
    data,
  }: { isLoading: boolean; error: AxiosError; data: any } = useQuery({
    queryKey: ["countryData"],
    queryFn: async (): Promise<AxiosResponse> => {
      const response: AxiosResponse = await axios.get(
        `http://localhost:5000/weathers/country?countryCode=${countryCode}`
      );
      response.data.forecast = checkCity(response.data.forecast, countryCode);
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const getCurrency = (
    currency: { [s: string]: unknown } | ArrayLike<unknown>
  ): string[] => {
    const niz: string[] = [];
    // Boze me oprosti
    for (const [, value] of Object.entries(currency)) {
      for (const [, vrednost] of Object.entries(value)) {
        niz.push(vrednost);
      }
    }
    return niz;
  };

  return (
    <div>
      {isLoading ? (
        <h1 className="country-container">Loading...</h1>
      ) : error ? (
        <>
          <h1 className="country-container">
            Code length should be equal to 2 characters, or country is
            unavailabe!
          </h1>
        </>
      ) : (
        <>
          <h1 className="center">{data.name}</h1>
          <h2 className="center">{data.officialName}</h2>
          <div className="country-container">
            <div className="header">
              <img src={data.flagUrl} alt="Flag" />
            </div>
            <div className="description">
              <p id="description">
                {data.name} is country in{" "}
                <span className="variable">{data.subContinent}</span> and it's
                capital city is{" "}
                <span className="variable">{data.capitalCity}</span>.{" "}
                {data.name} is{" "}
                {data.independent ? (
                  <span className="variable">independent</span>
                ) : (
                  <span className="variable">not independent</span>
                )}{" "}
                country with it's area of more than{" "}
                <span className="variable">{data.area}</span> km<sup>2</sup>,
                and population over{" "}
                <span className="variable">{data.population}</span> people.{" "}
                {data.name}{" "}
                {data.landlocked ? (
                  <span className="variable">doesn't have </span>
                ) : (
                  <span className="variable">has </span>
                )}{" "}
                access to the sea, and vehicles are driven on the{" "}
                <span className="variable">{data.drivingSide}</span> side of the
                road.
              </p>
              <div className="lists">
                <div>
                  <p>
                    Offical currency in {data.name} is{" "}
                    {Object.getOwnPropertyNames(data.currency)}:{" "}
                  </p>
                  <ul>
                    <li>
                      Currency name:{" "}
                      <span className="variable">
                        {getCurrency(data.currency)[0]}
                      </span>
                    </li>
                    <li>
                      Currency symbol:{" "}
                      <span className="variable">
                        {getCurrency(data.currency)[1]}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p>List of languages spoken:</p>
                  <ul>
                    {data.languages.map((lang: string, index: number) => (
                      <Fragment key={index}>
                        <li className="variable">{lang}</li>
                      </Fragment>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <h3 className="center" id="line">
            Here are the average temperatures of capital city for the next five
            days:
          </h3>

          <Results weathers={[data.forecast]} />
        </>
      )}
    </div>
  );
}