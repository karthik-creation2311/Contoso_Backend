const { Router } = require("express");
const authRouter = require("./auth.route");
const masterRouter = require("./master.route");
const router = Router();

router.use("/auth", authRouter);
router.use("/masters",masterRouter)

module.exports = router;
