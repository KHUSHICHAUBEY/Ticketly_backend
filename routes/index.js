const express = require("express");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

const User = require("../controller/userController");
const Ticket = require("../controller/ticketController");
const Label = require("../controller/labelController");

// ================= USER =================
router.post("/login", User.login);
router.post("/register", User.userRegister);

router.get("/getallusers", verifyToken, User.getAllUsers);
router.get("/view1", verifyToken, User.viewDetail);

// ================= TICKET =================
router.post("/createticket", verifyToken, Ticket.createTicket);
router.get("/viewalltickets", verifyToken, Ticket.viewAllTickets);
router.put("/updateticket", verifyToken, Ticket.updateTicket);
router.post("/filterticket", verifyToken, Ticket.filterTickets);
router.post("/createcomment", verifyToken, Ticket.createComment);
router.post("/viewcomment", verifyToken, Ticket.viewComment);

// ================= LABEL =================
router.post("/createlabel", verifyToken, Label.createLabel);
router.get("/viewlabel", verifyToken, Label.getAllLabels);
router.put("/updatelabel", verifyToken, Label.updateLabel);
router.delete("/deletelabel", verifyToken, Label.deleteLabel);

module.exports = router;