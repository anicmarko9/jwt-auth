import { useEffect, useMemo, useState } from "react";
import { handleInput } from "../features/helper";
import { getWeathers } from "../services/weather";
import { COUNTRIES } from "../mocks/mock";
import Results from "./Results";
import React from "react";
import { Weather } from "../types/weatherTypes";
import Table from "./Table";
import { InputData } from "../types/userTypes";
import LoadingPage from "./LoadingPage";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = (): JSX.Element => {
  const [weathers, setWeathers] = useState<Weather[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputCities, setInputCities] = useState<string>("");
  const [inputCountry, setInputCountry] = useState<string>("");
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const navigate = useNavigate();

  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    e.preventDefault();
    const input: InputData = handleInput("Weather");
    const weathersArray: Weather[] = await getWeathers(
      input.cities,
      input.country
    );
    setWeathers(weathersArray);
    setLoading(false);
  };

  const handleChangeCities = (event: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    setInputCities(event.target.value);
  };
  const handleChangeCountry = (event: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    setInputCountry(event.target.value);
  };

  useEffect(() => {
    if (params.get("cities") && params.get("countries")) {
      setLoading(true);
      (async () => {
        const weathersArray: Weather[] = await getWeathers(
          params.get("cities"),
          params.get("countries")
        );
        setWeathers(weathersArray);
        setLoading(false);
        setInputCities(params.get("cities"));
        setInputCountry(params.get("countries"));
        navigate("/weathers", { replace: true });
      })();
    }
  }, [navigate, params]);

  return (
    <div className="home-container">
      <Table countries={COUNTRIES} />
      <form className="inputForm" onSubmit={handleSubmit}>
        <select
          name="countries"
          id="countries"
          value={inputCountry}
          onChange={handleChangeCountry}
        >
          {COUNTRIES.map(
            (
              country: { code: string; cities: string[] },
              index: number
            ): JSX.Element => (
              <option key={index} value={country.code}>
                {country.code}
              </option>
            )
          )}
        </select>
        <input
          id="cities"
          type="search"
          name="cities"
          placeholder="Belgrade, Novi Sad, Niš"
          required={true}
          value={inputCities}
          onChange={handleChangeCities}
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="results-container">
          <Results weathers={weathers} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
