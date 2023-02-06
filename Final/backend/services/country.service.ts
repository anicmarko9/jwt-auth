import { City, ICountry } from "../types/weather.type";
import axios from "axios";
import { fetchCity } from "./weather.service";
import { COUNTRIES } from "./../mocks/countries.mock";
import AppError from "../utils/AppError";
import { Country } from "../models/relationships.model";

export const searchCountryDetails = async (
  countryCode: string
): Promise<Country> => {
  if (countryCode.length !== 2)
    throw new AppError("Code length should be equal to 2 characters!", 400);
  if (!COUNTRIES.some((el) => el.code === countryCode.toUpperCase()))
    throw new AppError("Country is unavailable!", 400);

  console.log("-------------------------------------------------------------");
  console.time("\nFetched all data synchronously in");
  let start: number = new Date().getTime();

  const country: ICountry = await fetchCountry(countryCode);

  console.log(
    `Fetched ${country.name} in: ${new Date().getTime() - start}ms` // kraj [ms]
  );
  const city: City = await fetchCity(
    country.capitalCity,
    countryCode.toUpperCase()
  );
  country.forecast = city;

  const findCountry = await Country.findOne({
    where: {
      name: country.name,
    },
  });
  if (findCountry) {
    findCountry.forecast = country.forecast;
    await findCountry.save();
  } else {
    console.timeEnd("\nFetched all data synchronously in");
    return await Country.create(country);
  }
  console.timeEnd("\nFetched all data synchronously in");
  return findCountry;
};

const fetchCountry = async (countryCode: string) => {
  try {
    const res = await axios.get(`${process.env.API_REST}${countryCode}`);
    const country: ICountry = {
      name: res.data[0].name.common,
      officialName: res.data[0].name.official,
      independent: res.data[0].independent,
      currency: res.data[0].currencies,
      capitalCity: res.data[0].capital[0].replace(/,+/g, ""),
      continent: res.data[0].region,
      subContinent: res.data[0].subregion,
      languages: Object.values(res.data[0].languages),
      landlocked: res.data[0].landlocked,
      area: res.data[0].area.toLocaleString(),
      population: res.data[0].population.toLocaleString(),
      drivingSide: res.data[0].car.side,
      flagUrl: res.data[0].flags.png,
    };
    return country;
  } catch (err) {
    throw new AppError("Bad request!", 400);
  }
};
