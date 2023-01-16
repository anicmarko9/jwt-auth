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
  // concurrent all countries
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
  // one country
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
  });
};

export const deleteAll = async () => {
  return await RequestCountry.destroy({
    truncate: true,
  });
};
export const deleteOne = async (id: number) => {
  const query = await RequestCountry.findByPk(id);
  if (!query) throw new AppError("Query already deleted!", 404);
  return await query.destroy();
};
