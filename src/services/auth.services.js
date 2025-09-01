const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const repo = require("../repositories/auth.repo");

async function register({ orgCode, email, password, givenName, familyName }) {
  const org = await repo.findOrganizationByCode(orgCode);
  if (!org) {
    const err = new Error("Organization not found");
    err.status = 404;
    throw err;
  }

  const existing = await repo.findUserByEmail(org.org_id, email.toLowerCase());
  if (existing) {
    const err = new Error("User already exists for this organization");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await repo.createUser({
    orgId: org.org_id,
    email: email.toLowerCase(),
    givenName,
    familyName,
    passwordHash,
  });

  const token = jwt.sign(
    { sub: user.user_id, org_id: user.org_id, email: user.email },
    jwtSecret,
    { expiresIn: "1h" }
  );

  return { user, token };
}

async function login({ orgCode, email, password }) {
  const org = await repo.findOrganizationByCode(orgCode);
  if (!org) {
    const err = new Error("Organization not found");
    err.status = 404;
    throw err;
  }

  const user = await repo.findUserByEmail(org.org_id, email.toLowerCase());
  if (!user || !user.password_hash) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { sub: user.user_id, org_id: user.org_id, email: user.email },
    jwtSecret,
    { expiresIn: "1h" }
  );

  // Only return safe subset
  const safeUser = {
    user_id: user.user_id,
    org_id: user.org_id,
    email: user.email,
    given_name: user.given_name ?? null,
    family_name: user.family_name ?? null,
  };

  return { user: safeUser, token };
}

module.exports = { register, login };

