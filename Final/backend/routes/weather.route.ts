import { Router } from "express";
import * as weatherController from "../controllers/weather.controller";
import * as authController from "./../controllers/auth.controller";
const router: Router = Router();

router.use(authController.loggedIn);

router.get("/forecast", weatherController.searchWeathers);
router.get("/country", weatherController.searchCountry);
router.get("/my-history", weatherController.showHistory);

export default router;
