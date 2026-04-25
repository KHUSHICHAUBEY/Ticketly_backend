const Ticket = require("../models/tickets");

// Create Ticket
const createTicketService = async (data) => {
  const { title, description, priority, assignTo, status, label, userId } = data;

  const highestTicket = await Ticket.findOne({}, { ticketNo: 1 })
    .sort({ ticketNo: -1 })
    .limit(1);

  const ticketNo = highestTicket ? highestTicket.ticketNo + 1 : 1;

  const ticket = await Ticket.create({
    ticketNo,
    title,
    description,
    priority: priority || "Low",
    status: status || "Open",
    label: label || [],
    assignTo: assignTo || "",
    assignBy: userId,
  });

  return ticket;
};


// Get all tickets
const getAllTicketsService = async () => {
  return await Ticket.find();
};


// Update Ticket
const updateTicketService = async (ticketId, updateData) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");

  Object.assign(ticket, updateData, { updatedAt: new Date() });

  return await ticket.save();
};


// Filter Tickets
const filterTicketsService = async (filters) => {
  const { assignedTo, priority, startDate, endDate } = filters;

  let query = {};

  if (assignedTo) query.assignTo = assignedTo;
  if (priority) query.priority = priority;

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return await Ticket.find(query);
};


// Add Comment
const addCommentService = async (ticketId, commentData) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");

  ticket.comments.push(commentData);

  return await ticket.save();
};


// Get Comments
const getCommentsService = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");

  return ticket.comments;
};


module.exports = {
  createTicketService,
  getAllTicketsService,
  updateTicketService,
  filterTicketsService,
  addCommentService,
  getCommentsService,
};