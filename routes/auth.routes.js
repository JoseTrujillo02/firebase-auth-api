import express from 'express';
import { body, validationResult } from 'express-validator';
import admin from '../firebase.js';
import fetch from 'node-fetch';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación con Firebase
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error de validación
 */
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión con email y contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        return res.status(400).json({ error: data.error.message });
      }

      res.status(200).json({
        message: 'Login exitoso',
        token: data.idToken,
        refreshToken: data.refreshToken,
        userId: data.localId,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
);

export default router;
