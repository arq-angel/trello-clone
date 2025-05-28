import express from "express";
import {register, login} from "../controllers/auth.controller";
import {validate} from "../middleware/validate.middleware";
import {LoginSchema, RegisterSchema} from "../validators/auth.validators";

const router = express.Router();

// @route POST /api/auth/register
router.post('/register', validate(RegisterSchema), register);

// @route POST /api/auth/login
router.post('/login', validate(LoginSchema), login);

export default router;