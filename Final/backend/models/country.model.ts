import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db.util";
import { City } from "../types/weather.type";

class Country extends Model {
  public id: number;
  public name: string;
  public officialName: string;
  public independent: boolean;
  public currency: { code: { name: string; symbol: string } };
  public capitalCity: string;
  public continent: string;
  public subContinent: string;
  public languages: string[];
  public landlocked: boolean;
  public area: string;
  public population: string;
  public drivingSide: string;
  public flagUrl: string;
  public mapUrl: string;
  public forecast: City;
}

Country.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    officialName: {
      type: DataTypes.STRING,
    },
    independent: {
      type: DataTypes.BOOLEAN,
    },
    currency: {
      type: DataTypes.JSON,
    },
    capitalCity: {
      type: DataTypes.STRING,
    },
    continent: {
      type: DataTypes.STRING,
    },
    subContinent: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    landlocked: {
      type: DataTypes.BOOLEAN,
    },
    area: {
      type: DataTypes.STRING,
    },
    population: {
      type: DataTypes.STRING,
    },
    drivingSide: {
      type: DataTypes.STRING,
    },
    flagUrl: {
      type: DataTypes.STRING,
    },
    mapUrl: {
      type: DataTypes.STRING,
    },
    forecast: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "country",
  }
);

export default Country;
