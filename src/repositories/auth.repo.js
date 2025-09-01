const { prisma } = require("../integrations/prisma");

async function findOrganizationByCode(code) {
  return prisma.organizations.findUnique({ where: { code } });
}

async function findUserByEmail(orgId, email) {
  return prisma.users.findUnique({ where: { org_id_email: { org_id: orgId, email } } });
}

async function createUser({ orgId, email, givenName, familyName, passwordHash }) {
  return prisma.users.create({
    data: {
      org_id: orgId,
      email,
      given_name: givenName || null,
      family_name: familyName || null,
      password_hash: passwordHash,
      status: "active",
    },
    select: {
      user_id: true,
      org_id: true,
      email: true,
      given_name: true,
      family_name: true,
      display_name: true,
      created_at: true,
    },
  });
}

module.exports = {
  findOrganizationByCode,
  findUserByEmail,
  createUser,
};

