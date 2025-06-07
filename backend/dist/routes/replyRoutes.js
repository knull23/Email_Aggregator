"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const replyController_1 = require("../controllers/replyController");
const router = (0, express_1.Router)();
router.post('/:emailId', replyController_1.getSuggestedReply);
exports.default = router;
