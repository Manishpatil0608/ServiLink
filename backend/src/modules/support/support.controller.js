import { sendSuccess } from '../../utils/response.js';
import {
  createSupportTicket,
  getCustomerTickets,
  getCustomerTicketByCode,
  addCustomerTicketMessage
} from './support.service.js';

export const handleCreateSupportTicket = async (req, res, next) => {
  try {
    const ticket = await createSupportTicket(req.user.sub, req.body);
    return sendSuccess(res, ticket, null, 201);
  } catch (error) {
    return next(error);
  }
};

export const handleListCustomerTickets = async (req, res, next) => {
  try {
    const { data, meta } = await getCustomerTickets(req.user.sub, req.query);
    return sendSuccess(res, data, meta);
  } catch (error) {
    return next(error);
  }
};

export const handleGetCustomerTicket = async (req, res, next) => {
  try {
    const ticket = await getCustomerTicketByCode(req.user.sub, req.params.ticketCode);
    return sendSuccess(res, ticket);
  } catch (error) {
    return next(error);
  }
};

export const handleAddCustomerTicketMessage = async (req, res, next) => {
  try {
    const ticket = await addCustomerTicketMessage(req.user.sub, req.params.ticketCode, req.body);
    return sendSuccess(res, ticket, null, 201);
  } catch (error) {
    return next(error);
  }
};
