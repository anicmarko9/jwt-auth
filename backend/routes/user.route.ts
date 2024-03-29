import { Router } from "express";
import * as userController from "./../controllers/user.controller";
import * as authController from "./../controllers/auth.controller";
const router: Router = Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

router.post("/reset-password", authController.forgotPasswordLink);
router.patch(
  "/password-reset/confirm/:token",
  authController.resetPasswordLink
);

router.use(authController.protectUser);

router.patch("/password", authController.updateMyPassword);

router
  .route("/me")
  .get(userController.getMe, userController.getUser)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .delete(userController.deleteMe, authController.logoutUser);

router.use(authController.restrictToUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
