import React, { useState } from "react";
import { handleInput } from "../features/helper";
import { sendEmailResetToken } from "../services/auth";
import { InputData } from "../types/userTypes";
import LoadingPage from "./LoadingPage";

const ForgotPassword = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const handleSubmit = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    setLoading(true);
    try {
      e.preventDefault();
      const input: InputData = handleInput("ForgotPassword");
      await sendEmailResetToken(input.email);
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

  return (
    <div className="forgot-password">
      {loading ? (
        <LoadingPage />
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Forgot password?</h2>
          <p>Please enter your email to search for your account.</p>
          <input
            type="text"
            id="email"
            placeholder="example@mail.com"
            autoFocus={true}
            value={email}
            onChange={handleChangeEmail}
          />
          <div>
            <button type="submit">Send link to email</button>
            <a href="/login">Back to login</a>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
