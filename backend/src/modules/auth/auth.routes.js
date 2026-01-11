import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { registerValidator, loginValidator, refreshValidator, logoutValidator, googleLoginValidator, forgotPasswordValidator, resetPasswordValidator } from './auth.validator.js';
import { registerController, loginController, refreshController, logoutController, googleLoginController, requestPasswordResetController, resetPasswordController } from './auth.controller.js';

const router = Router();

router.post('/register', validate(registerValidator), registerController);
router.post('/login', validate(loginValidator), loginController);
router.post('/refresh', validate(refreshValidator), refreshController);
router.post('/logout', validate(logoutValidator), logoutController);
router.post('/google', validate(googleLoginValidator), googleLoginController);
router.post('/password/forgot', validate(forgotPasswordValidator), requestPasswordResetController);
router.post('/password/reset', validate(resetPasswordValidator), resetPasswordController);

export default router;
