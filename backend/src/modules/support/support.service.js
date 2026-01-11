import { withTransaction } from '../../config/database.js';
import { AppError } from '../../utils/appError.js';
import {
  generateUniqueTicketCode,
  insertTicket,
  insertTicketMessage,
  listTicketsForCustomer,
  findTicketByCodeForCustomer,
  listTicketMessages,
  updateTicket
} from './support.repository.js';
import { SUPPORT_CATEGORIES, SUPPORT_PRIORITIES, SUPPORT_STATUSES } from './support.constants.js';

const sanitizePagination = ({ page = 1, pageSize = 10 }) => {
  const limit = Math.min(Math.max(Number(pageSize) || 10, 1), 50);
  const currentPage = Math.max(Number(page) || 1, 1);
  const offset = (currentPage - 1) * limit;
  return { limit, offset, currentPage };
};

const parseNullableNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const parseAttachments = (value) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const normalizeAgent = (row) => {
  if (!row.assignedAgentId) {
    return null;
  }

  return {
    id: Number(row.assignedAgentId),
    email: row.assignedAgentEmail || null,
    role: row.assignedAgentRole || null,
    firstName: row.assignedAgentFirstName || null,
    lastName: row.assignedAgentLastName || null
  };
};

const normalizeTicketRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    ticketCode: row.ticketCode,
    customerId: Number(row.customerId),
    subject: row.subject,
    description: row.description,
    category: row.category,
    priority: row.priority,
    status: row.status,
    relatedBookingId: parseNullableNumber(row.relatedBookingId),
    relatedProviderId: parseNullableNumber(row.relatedProviderId),
    assignedAgent: normalizeAgent(row),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null
  };
};

const normalizeMessageRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    ticketId: Number(row.ticketId),
    senderId: Number(row.senderId),
    sender: {
      id: Number(row.senderId),
      email: row.senderEmail || null,
      role: row.senderRole || null,
      firstName: row.senderFirstName || null,
      lastName: row.senderLastName || null
    },
    message: row.message,
    attachments: parseAttachments(row.attachments),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : null
  };
};

const loadCustomerTicketDetail = async (customerId, ticketCode, trx) => {
  const ticketRow = await findTicketByCodeForCustomer(ticketCode, customerId, trx);
  if (!ticketRow) {
    return null;
  }

  const messages = await listTicketMessages(ticketRow.id, trx);
  return {
    ...normalizeTicketRow(ticketRow),
    messages: messages.map(normalizeMessageRow)
  };
};

export const createSupportTicket = async (customerId, payload) => {
  const {
    subject,
    message,
    category,
    priority = 'medium',
    relatedBookingId = null,
    relatedProviderId = null,
    attachments = []
  } = payload;

  if (!SUPPORT_CATEGORIES.includes(category)) {
    throw new AppError('Unsupported support category.', 400, 'SUPPORT_INVALID_CATEGORY');
  }

  if (!SUPPORT_PRIORITIES.includes(priority)) {
    throw new AppError('Unsupported support priority.', 400, 'SUPPORT_INVALID_PRIORITY');
  }

  return withTransaction(async (trx) => {
    const ticketCode = await generateUniqueTicketCode(trx);

    const ticketPayload = {
      ticket_code: ticketCode,
      user_id: customerId,
      category,
      priority,
      status: 'open',
      subject,
      description: message,
      related_booking_id: relatedBookingId,
      related_provider_id: relatedProviderId
    };

    const ticketId = await insertTicket(ticketPayload, trx);

    await insertTicketMessage({
      ticket_id: ticketId,
      sender_id: customerId,
      message,
      attachments: attachments.length ? JSON.stringify(attachments) : null
    }, trx);

    const detail = await loadCustomerTicketDetail(customerId, ticketCode, trx);
    return detail;
  });
};

export const getCustomerTickets = async (customerId, filters = {}) => {
  const pagination = sanitizePagination(filters);
  const status = filters.status || null;
  const category = filters.category || null;
  const priority = filters.priority || null;

  if (status && !SUPPORT_STATUSES.includes(status)) {
    throw new AppError('Unsupported ticket status filter.', 400, 'SUPPORT_INVALID_STATUS');
  }

  if (category && !SUPPORT_CATEGORIES.includes(category)) {
    throw new AppError('Unsupported ticket category filter.', 400, 'SUPPORT_INVALID_CATEGORY');
  }

  if (priority && !SUPPORT_PRIORITIES.includes(priority)) {
    throw new AppError('Unsupported ticket priority filter.', 400, 'SUPPORT_INVALID_PRIORITY');
  }

  const { data, total } = await listTicketsForCustomer(customerId, {
    status,
    category,
    priority,
    limit: pagination.limit,
    offset: pagination.offset
  });

  return {
    data: data.map(normalizeTicketRow),
    meta: {
      total,
      page: pagination.currentPage,
      pageSize: pagination.limit,
      totalPages: Math.max(Math.ceil(total / pagination.limit) || 1, 1)
    }
  };
};

export const getCustomerTicketByCode = async (customerId, ticketCode) => {
  const detail = await loadCustomerTicketDetail(customerId, ticketCode);
  if (!detail) {
    throw new AppError('Support ticket not found.', 404, 'SUPPORT_TICKET_NOT_FOUND');
  }
  return detail;
};

export const addCustomerTicketMessage = async (customerId, ticketCode, payload) => {
  const { message, attachments = [] } = payload;

  if (!message || !message.trim()) {
    throw new AppError('Message body cannot be empty.', 400, 'SUPPORT_MESSAGE_REQUIRED');
  }

  await withTransaction(async (trx) => {
    const ticketRow = await findTicketByCodeForCustomer(ticketCode, customerId, trx);
    if (!ticketRow) {
      throw new AppError('Support ticket not found.', 404, 'SUPPORT_TICKET_NOT_FOUND');
    }

    if (['resolved', 'closed'].includes(ticketRow.status)) {
      await updateTicket(ticketRow.id, { status: 'open' }, trx);
    }

    await insertTicketMessage({
      ticket_id: ticketRow.id,
      sender_id: customerId,
      message,
      attachments: attachments.length ? JSON.stringify(attachments) : null
    }, trx);
  });

  return getCustomerTicketByCode(customerId, ticketCode);
};
