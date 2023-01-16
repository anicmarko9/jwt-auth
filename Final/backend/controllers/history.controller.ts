import { Request, Response, NextFunction } from "express";
import {
  adminCountAllSearches,
  countAllSearches,
  deleteAll,
  deleteOne,
} from "../services/history.service";

export async function showMyHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const countries = await countAllSearches(res.locals.user.id);
    // get queries requested (countries visited) by current logged in user
    res.status(200).json({
      status: "success",
      countries,
    });
  } catch (err) {
    next(err);
  }
}

export async function showAllHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const countries = await adminCountAllSearches();

    // get all queries (countries visited) from all users
    res.status(200).json({
      status: "success:",
      countries,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    id ? await deleteOne(parseInt(id)) : await deleteAll();
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
