import {
  Model,
  DataTypes,
  InstanceUpdateOptions,
  CreateOptions,
} from "sequelize";
import { formatDate } from "../services/history.service";
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
      onDelete: "CASCADE",
      references: { model: "users", key: "id" },
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
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
    timestamps: false,
    modelName: "request",
    hooks: {
      beforeSave: async (
        request: RequestCountry,
        options: InstanceUpdateOptions<any> | CreateOptions<any>
      ): Promise<void> => {
        request.timestamp = formatDate(new Date());
      },
    },
  }
);

export default RequestCountry;
