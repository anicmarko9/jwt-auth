import {
  Model,
  DataTypes,
  InstanceUpdateOptions,
  CreateOptions,
} from "sequelize";
import { sequelize } from "../utils/db.util";

class RequestCountry extends Model {
  public id!: number;
  public userId!: number;
  public countryId!: number;
  public query!: string;
  public timestamp: string;
}

RequestCountry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "countries", key: "id" },
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    paranoid: true,
    timestamps: false,
    modelName: "request",
    hooks: {
      beforeSave: async (
        request: RequestCountry,
        options: InstanceUpdateOptions<any> | CreateOptions<any>
      ): Promise<void> => {
        const now: Date = new Date();
        const date: string = `${now.getFullYear()}-${
          now.getMonth() + 1
        }-${now.getDate()}`;
        const time: string = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        request.timestamp = `${date} ${time}`;
      },
    },
  }
);

export default RequestCountry;
