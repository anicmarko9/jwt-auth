import * as jwt from "jsonwebtoken";
import AppError from "../utils/AppError";
import { User } from "./../models/relationships.model";
import { TypedRequestBody } from "../types/user.type";
import { NextFunction, Response } from "express";
import { sendEmail } from "./../services/email.service";
import {
  authLogin,
  authSignup,
  checkLogin,
  findUser,
} from "../services/auth.service";

const signToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (
  user: User,
  statusCode: number,
  req: TypedRequestBody<User>,
  res: Response
): void => {
  const token: string = signToken(user.id);

  res.cookie("jwt", token, {
    // 3 months
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });

  // remove password from output
  user.password = null;
  user.passwordConfirm = null;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = async (
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, passwordConfirm, role } = req.body;
  try {
    const newUser: User = await authSignup(
      name,
      email,
      password,
      passwordConfirm,
      role
    );
    const url: string = `${process.env.FRONT_URL}/me`;
    await sendEmail(newUser, url, "Welcome");
    createSendToken(newUser, 201, req, res);
  } catch (error) {
    if (error.isOperational) {
      next(error);
    } else {
      try {
        next(new AppError(error.errors[0].message, 400));
      } catch (err) {
        next(error);
      }
    }
  }
};

export const login = async (
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user: User = await authLogin(email, password);
    // login user, send JWT
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};

export const logout = (
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
): void => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ status: "success" });
};

export const protect = async (
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // get token and check if it's there
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  try {
    // verification token
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;

    // check if user still exists
    const currentUser: User = await findUser(decoded.id, decoded.iat);

    // grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    err instanceof jwt.JsonWebTokenError
      ? next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        )
      : next(err);
  }
};

export const isLoggedIn = async (
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  try {
    // verify token
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as jwt.JwtPayload;
    // check if user still exists

    const currentUser: User = await checkLogin(decoded.id, decoded.iat);

    // if there is a logged in user
    res.locals.user = currentUser;
    return next();
  } catch (err) {
    err instanceof jwt.JsonWebTokenError
      ? next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        )
      : next(err);
  }
};

export const restrictTo = (
  ...roles: string[]
): ((
  req: TypedRequestBody<User>,
  res: Response,
  next: NextFunction
) => void) => {
  return (
    req: TypedRequestBody<User>,
    res: Response,
    next: NextFunction
  ): void => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do that!", 403));
    }
    next();
  };
};
