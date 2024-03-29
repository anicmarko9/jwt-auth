import * as crypto from "crypto";
import AppError from "../utils/AppError";
import { User } from "../models/relationships.model";
import { Op } from "sequelize";
import { sendEmail } from "./email.service";

export const authSignup = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  role: string
): Promise<User> => {
  return await User.create({ name, email, password, passwordConfirm, role });
};

export const authLogin = async (
  email: string,
  password: string
): Promise<User> => {
  if (!email || !password) {
    throw new AppError("Please provide email and password!", 400);
  }
  const user: User = await User.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Incorrect email or password!", 401);
  }
  return user;
};

export const findUser = async (id: string, iat: number): Promise<User> => {
  // check if user still exists
  const currentUser: User = await User.scope("withoutPassword").findByPk(
    parseInt(id)
  );
  if (!currentUser) throw checkUser(401);

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(iat)) {
    throw new AppError(
      "User recently changed password! Please log in again.",
      401
    );
  }
  return currentUser;
};

export const checkLogin = async (id: string, iat: number): Promise<User> => {
  const currentUser: User = await User.scope("withoutPassword").findByPk(
    parseInt(id)
  );
  if (!currentUser) {
    throw checkUser(401);
  }

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(iat)) {
    throw new AppError(
      "User recently changed password! Please log in again.",
      401
    );
  }
  return currentUser;
};

export const setUserResetToken = async (email: string): Promise<User> => {
  if (!email) throw new AppError("Please provide email", 400);
  const user: User = await User.scope("withoutPassword").findOne({
    where: { email },
  });
  if (!user) throw checkUser(404);
  return user;
};

export const authResetPassword = async (
  password: string,
  passwordConfirm: string,
  token: string
): Promise<User> => {
  // get user based on the token param
  const hashedToken: string = hashToken(token);

  const user: User = await User.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) throw checkUser(400);

  // if token hasn't expired, and there is user, set the new password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  // changedPasswordAt -> updated pre-save
  await user.save();
  return user;
};

export const validateUserPassword = async (
  password: string,
  passwordConfirm: string,
  passwordCurrent: string,
  id: number
): Promise<User> => {
  // get user from DB
  const user: User = await User.findByPk(id);

  // check if POSTed current password is correct
  if (!(await user.correctPassword(passwordCurrent, user.password)))
    throw new AppError("Your current password is wrong.", 401);

  // update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  return user;
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    var user: User = await setUserResetToken(email);
    const resetToken: string = user.createPasswordResetToken();
    const resetURL: string = `${process.env.FRONT_URL}/reset-password/${resetToken}`;
    const prom1: Promise<User> = user.save({ validate: false });
    const prom2: Promise<void> = sendEmail(user, resetURL, "PasswordReset");
    await Promise.all([prom1, prom2]);
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 400) throw err;
    else {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save({ validate: false });
      throw new AppError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }
};

export const resetPassword = async (
  password: string,
  passwordConfirm: string,
  token: string
): Promise<User> => {
  try {
    const user: User = await authResetPassword(
      password,
      passwordConfirm,
      token
    );
    // login user, send JWT
    return user;
  } catch (err) {
    if (err.isOperational) {
      throw err;
    } else {
      throw new AppError(err.errors[0].message, 400);
    }
  }
};

export const updatePassword = async (
  password: string,
  passwordConfirm: string,
  passwordCurrent: string,
  id: number
): Promise<User> => {
  try {
    return await validateUserPassword(
      password,
      passwordConfirm,
      passwordCurrent,
      id
    );
  } catch (err) {
    if (err.isOperational) {
      throw err;
    } else {
      throw new AppError(err.errors[0].message, 400);
    }
  }
};

const checkUser = (code: number): AppError => {
  let text: string;
  switch (code) {
    case 400:
      text = "Token is invalid or has expired";
      break;
    case 401:
      text = "The user belonging to this token does no longer exist.";
      break;
    case 404:
      text = "There is no user with this email address.";
      break;
    default:
      text = "Something went very wrong!";
  }
  return new AppError(text, code);
};

const hashToken = (token: string): string => {
  // digest with same method from model method
  // so it can match token from DB
  return crypto.createHash("sha256").update(token).digest("hex");
};
