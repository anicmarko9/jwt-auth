import { Response, NextFunction } from "express";
import { TypedRequestBody } from "../types/user.type";
import { User } from "./../models/relationships.model";
import {
  login,
  logout,
  signup,
  protect,
  isLoggedIn,
  restrictTo,
  createSendToken,
} from "./../middlewares/auth.middleware";
import {
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../services/auth.service";

export async function signupUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await signup(req, res, next);
}
export async function loginUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await login(req, res, next);
}

export function logoutUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  logout(req, res, next);
}
export async function protectUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await protect(req, res, next);
}
export async function loggedIn(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  await isLoggedIn(req, res, next);
}
export function restrictToUser(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  restrictTo("admin")(req, res, next);
}

export async function forgotPasswordLink(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    await forgotPassword(email);
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordLink(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, passwordConfirm } = req.body;
    const user: User = await resetPassword(
      password,
      passwordConfirm,
      req.params.token.toString()
    );
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
}

export async function updateMyPassword(
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) {
  try {
    const { password, passwordConfirm, passwordCurrent } = req.body;
    const user: User = await updatePassword(
      password,
      passwordConfirm,
      passwordCurrent,
      parseInt(req.params.id)
    );
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
}
