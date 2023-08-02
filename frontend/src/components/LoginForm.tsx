import React, { useState } from "react";
import { handleInput } from "../features/helper";
import { InputData } from "../types/userTypes";
import { login } from "./../services/auth";
import LoadingPage from "./LoadingPage";

const LoginForm = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    try {
      e.preventDefault();
      const input: InputData = handleInput("Login");
      await login(input.email, input.password);
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (event: {
    target: { value: React.SetStateAction<string> };
  }): void => {
    setEmail(event.target.value || "");
  };

  const createNewAcc = (): void => {
    window.location.href = "/signup";
  };

  return (
    <>
      <div className="colm-form">
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleChangeEmail}
            placeholder="Email address"
          />
          <input id="password" type="password" placeholder="Password" />
          <button type="submit" className="btn-login">
            Login
          </button>
          <a href="login/forgot-password">Forgotten password?</a>
          <button type="button" onClick={createNewAcc} className="btn-new">
            Create new Account
          </button>
        </form>
      </div>
      {loading ? <LoadingPage /> : <div></div>}
    </>
  );
};

export default LoginForm;
