import express from "express";
const router = express.Router();

const conversationRoutes = require('./conversation');
const userRoutes = require("./user");
const messageRoutes = require("./message");

router.use('/conversations', conversationRoutes);
router.use('/', userRoutes);
router.use('/conversation/:id/', messageRoutes);

export default router;