const { z } = require("zod");
const svc = require("../services/auth.services");

const registerSchema = z.object({
  orgCode: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  givenName: z.string().min(1).optional(),
  familyName: z.string().min(1).optional(),
});

const loginSchema = z.object({
  orgCode: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await svc.register(data);
    res.status(201).json(result);
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await svc.login(data);
    res.json(result);
  } catch (err) { next(err); }
}

module.exports = { register, login };

