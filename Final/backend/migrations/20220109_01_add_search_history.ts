import { DataTypes } from "sequelize";

export const up = async ({ context: queryInterface }): Promise<void> => {
  await queryInterface.createTable("requests", {
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
      allowNull: false,
    },
  });
};
export const down = async ({ context: queryInterface }): Promise<void> => {
  await queryInterface.dropTable("requests");
};
