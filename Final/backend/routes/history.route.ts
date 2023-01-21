import { Router } from "express";
import * as historyController from "../controllers/history.controller";
import * as authController from "./../controllers/auth.controller";
const router: Router = Router();

router
  .route("/me/:id?")
  .get(authController.loggedIn, historyController.showMyHistory)
  .delete(authController.loggedIn, historyController.deleteHistory);

router.use(authController.protectUser, authController.restrictToUser);

router.get("/all", historyController.showAllHistory);

export default router;
