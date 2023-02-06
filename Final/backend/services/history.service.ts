import { Country, RequestCountry } from "../models/relationships.model";
import AppError from "../utils/AppError";

export const countAllSearches = async (
  currentUserId: number
): Promise<
  {
    rows: RequestCountry[];
    count: number;
  }[]
> => {
  // concurrent all countries for current user only
  const all: Promise<{
    rows: RequestCountry[];
    count: number;
  }>[] = [];
  const countries: Country[] = await Country.findAll();
  countries.forEach((el: Country) => {
    all.push(countSearches(el.id, currentUserId));
  });
  return await Promise.all(all);
};

const countSearches = async (
  id: number,
  currentUserId: number
): Promise<{
  rows: RequestCountry[];
  count: number;
}> => {
  // one country for current user
  return await RequestCountry.findAndCountAll({
    where: {
      countryId: id,
      userId: currentUserId,
    },
    order: [["timestamp", "DESC"]],
  });
};

export const adminCountAllSearches = async (): Promise<
  {
    rows: RequestCountry[];
    count: number;
  }[]
> => {
  // concurrent all countries
  const all: Promise<{
    rows: RequestCountry[];
    count: number;
  }>[] = [];
  const countries: Country[] = await Country.findAll();
  countries.forEach((el: Country) => {
    all.push(adminCountSearches(el.id));
  });
  return await Promise.all(all);
};

const adminCountSearches = async (
  id: number
): Promise<{
  rows: RequestCountry[];
  count: number;
}> => {
  // one country
  return await RequestCountry.findAndCountAll({
    where: {
      countryId: id,
    },
    order: [["timestamp", "DESC"]],
  });
};

// clear search history for current user
export const deleteAll = async (id: number): Promise<void[]> => {
  const all: Promise<void>[] = [];
  const allQueries: RequestCountry[] = await RequestCountry.findAll({
    where: {
      userId: id,
    },
  });
  allQueries.forEach((query: RequestCountry) => {
    all.push(query.destroy());
  });
  return await Promise.all(all);
};

// delete single search result
export const deleteOne = async (id: number): Promise<void> => {
  const query: RequestCountry = await RequestCountry.findByPk(id);
  if (!query) throw new AppError("Query already deleted!", 404);
  return await query.destroy();
};
