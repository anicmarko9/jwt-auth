import User from "./user.model";
import Country from "./country.model";
import RequestCountry from "./request.model";

User.belongsToMany(Country, { through: RequestCountry });
Country.belongsToMany(User, { through: RequestCountry });

export { User, Country, RequestCountry };
