export type Weather = {
  name?: string;
  temp?: number[];
  avgTemp?: number;
  dblAvgTemp: number;
  day?: number[];
  dayName?: string[];
  date?: string;
  gradientColors: string[];
  img?: string[];
  country: string;
  error: string;
};
export type City = {
  name: string;
  temps: number[];
  days: string[];
  img: string[];
};

export type Country = {
  id: number;
  name?: string;
  officialName?: string;
  independent?: boolean;
  currency?: { code: { name: string; symbol: string } };
  capitalCity?: string;
  continent?: string;
  subContinent?: string;
  languages?: string[];
  landlocked?: boolean;
  area?: number;
  population?: number;
  drivingSide?: string;
  flagUrl?: string;
  mapUrl?: string;
  forecast?: City;
  counter?: number;
};

export type IQuery = {
  id: number;
  countryId: number;
  userId: number;
  query: string;
  timestamp: string;
};

export type IHistory = {
  count: number;
  rows?: IQuery[];
};
