import React, { useState } from "react";
import { handleInput } from "../features/helper";
import { signup } from "../services/auth";
import { InputData } from "../types/userTypes";
import LoadingPage from "./LoadingPage";

const SignupForm = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    try {
      e.preventDefault();
      const input: InputData = handleInput("Signup");
      await signup(
        input.name,
        input.email,
        input.password,
        input.passwordConfirm
      );
    } catch (error) {
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="colm-form">
      {loading ? (
        <LoadingPage />
      ) : (
        <form className="form-container" onSubmit={handleSubmit}>
          <input id="name" type="text" placeholder="Full name" />
          <input id="email" type="text" placeholder="Email address" />
          <input id="password" type="password" placeholder="Password" />
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Password confirm"
          />
          <a href="/login">Already have an account?</a>
          <button type="submit" className="btn-new">
            Create new Account
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;
