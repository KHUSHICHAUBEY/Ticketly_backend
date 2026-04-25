const ticketService = require("../services/ticketService");


// Create Ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, assignTo } = req.body;

    if (!title || !description || !priority || !assignTo) {
      return res.status(400).json({ success: 0, message: "Missing fields" });
    }

    const ticket = await ticketService.createTicketService({
      ...req.body,
      userId: req.authUser._id.toString(),
    });

    res.status(200).json({
      success: 1,
      message: "Ticket created",
      data: ticket,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


// Get All Tickets
const viewAllTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getAllTicketsService();

    res.status(200).json({
      success: 1,
      data: tickets,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


// Update Ticket
const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: 0, message: "Ticket ID required" });
    }

    const updated = await ticketService.updateTicketService(ticketId, req.body);

    res.status(200).json({
      success: 1,
      data: updated,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


// Filter Tickets
const filterTickets = async (req, res) => {
  try {
    const data = await ticketService.filterTicketsService(req.body);

    res.status(200).json({
      success: 1,
      data,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


// Add Comment
const createComment = async (req, res) => {
  try {
    const { ticketId, comment } = req.body;

    const updated = await ticketService.addCommentService(ticketId, {
      comment,
      ticketId,
      createdAt1: new Date(),
    });

    res.status(200).json({
      success: 1,
      data: updated,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


// Get Comments
const viewComment = async (req, res) => {
  try {
    const comments = await ticketService.getCommentsService(req.body.ticketId);

    res.status(200).json({
      success: 1,
      data: comments,
    });

  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};


module.exports = {
  createTicket,
  viewAllTickets,
  updateTicket,
  filterTickets,
  createComment,
  viewComment,
};