import React from "react";

const ErrorHeading = ({ error }): JSX.Element => {
  return (
    <>
      {error.code === "ERR_NETWORK" ? (
        <h1>{error.message}</h1>
      ) : (
        <h1>{error.response.data["message"]}</h1>
      )}
      {console.clear()}
    </>
  );
};

export default ErrorHeading;
