import User from "./user.model";
import Country from "./country.model";
import RequestCountry from "./request.model";

User.belongsToMany(Country, { through: RequestCountry, onDelete: "CASCADE" });
Country.belongsToMany(User, { through: RequestCountry, onDelete: "CASCADE" });

export { User, Country, RequestCountry };
