import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const Table = ({
  countries,
}: {
  countries: { code: string; cities: string[] }[];
}): JSX.Element => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Countries</th>
            <th>Cities</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(
            (
              country: { code: string; cities: string[] },
              index: number
            ): JSX.Element => (
              <Fragment key={index}>
                <tr>
                  <th>
                    <Link to={`/weathers/${country.code}`}>{country.code}</Link>
                  </th>
                  {country.cities.map(
                    (city: string, index: number): JSX.Element => (
                      <Fragment key={index}>
                        <td>
                          <Link
                            to={`/weathers?cities=${city}&countries=${country.code}`}
                          >
                            {city}
                          </Link>
                          {/* Adding comma ", " if city is not the last element */}
                          {country.cities.length - index === 1 ? (
                            <span></span>
                          ) : (
                            <span>, </span>
                          )}
                        </td>
                      </Fragment>
                    )
                  )}
                </tr>
              </Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
