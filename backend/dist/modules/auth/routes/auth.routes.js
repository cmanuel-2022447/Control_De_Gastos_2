"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
// Endpoint de login: recibe credenciales y retorna token JWT
router.post('/login', auth_controller_1.AuthController.login);
exports.default = router;
