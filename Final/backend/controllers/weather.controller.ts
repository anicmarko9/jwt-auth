import { searchForecast } from "../services/weather.service";
import { searchCountryDetails } from "../services/country.service";
import { Request, Response, NextFunction } from "express";
import { City } from "../types/weather.type";
import { Country, RequestCountry, User } from "../models/relationships.model";
import { myHistory } from "../services/user.service";

export async function searchWeathers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { cities, countries } = req.query;
  const weather: City[] = await searchForecast(
    cities.toString(),
    countries.toString()
  );
  res.status(200).json({
    weather,
  });
}

export async function searchCountry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { countryCode } = req.query;
  try {
    const country: Country = await searchCountryDetails(countryCode.toString());
    await RequestCountry.create({
      userId: res.locals.user.id,
      countryId: country.id,
      query: countryCode.toString(),
    });
    res.status(200).json({
      status: "success",
      country,
    });
  } catch (err) {
    next(err);
  }
}

export async function showHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const history: RequestCountry[] = await myHistory(res.locals.user.id);
  res.status(200).json({
    status: "success",
    results: history.length,
    history,
  });
}
