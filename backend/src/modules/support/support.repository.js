import crypto from 'crypto';
import { db } from '../../config/database.js';

const TICKET_COLUMNS = [
  't.id',
  't.ticket_code as ticketCode',
  't.user_id as customerId',
  't.assigned_to as assignedAgentId',
  't.category',
  't.priority',
  't.status',
  't.subject',
  't.description',
  't.related_booking_id as relatedBookingId',
  't.related_provider_id as relatedProviderId',
  't.created_at as createdAt',
  't.updated_at as updatedAt',
  'agent.email as assignedAgentEmail',
  'agent.role as assignedAgentRole',
  'agent_profile.first_name as assignedAgentFirstName',
  'agent_profile.last_name as assignedAgentLastName'
];

const MESSAGE_COLUMNS = [
  'm.id',
  'm.ticket_id as ticketId',
  'm.sender_id as senderId',
  'm.message',
  'm.attachments',
  'm.created_at as createdAt',
  'm.updated_at as updatedAt',
  'sender.email as senderEmail',
  'sender.role as senderRole',
  'sender_profile.first_name as senderFirstName',
  'sender_profile.last_name as senderLastName'
];

const buildTicketQuery = (trx = db) => {
  return trx('support_tickets as t')
    .leftJoin('users as agent', 't.assigned_to', 'agent.id')
    .leftJoin('user_profiles as agent_profile', 'agent_profile.user_id', 'agent.id');
};

const buildMessageQuery = (trx = db) => {
  return trx('ticket_messages as m')
    .leftJoin('users as sender', 'm.sender_id', 'sender.id')
    .leftJoin('user_profiles as sender_profile', 'sender_profile.user_id', 'sender.id');
};

export const generateUniqueTicketCode = async (trx = db) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const createCode = () => Array.from({ length: 10 }, () => alphabet[crypto.randomInt(alphabet.length)]).join('');

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = createCode();
    const existing = await trx('support_tickets').where({ ticket_code: candidate }).first();
    if (!existing) {
      return candidate;
    }
  }

  throw new Error('Unable to generate unique support ticket code');
};

export const insertTicket = async (payload, trx = db) => {
  const [id] = await trx('support_tickets').insert(payload);
  return id;
};

export const insertTicketMessage = async (payload, trx = db) => {
  const [id] = await trx('ticket_messages').insert(payload);
  return id;
};

export const listTicketsForCustomer = async (customerId, { status, category, priority, limit, offset }, trx = db) => {
  const query = buildTicketQuery(trx)
    .clone()
    .where('t.user_id', customerId)
    .orderBy('t.created_at', 'desc');

  if (status) {
    query.andWhere('t.status', status);
  }

  if (category) {
    query.andWhere('t.category', category);
  }

  if (priority) {
    query.andWhere('t.priority', priority);
  }

  const data = await query
    .clone()
    .select(TICKET_COLUMNS)
    .limit(limit)
    .offset(offset);

  const countQuery = buildTicketQuery(trx)
    .clone()
    .clearSelect()
    .where('t.user_id', customerId);

  if (status) {
    countQuery.andWhere('t.status', status);
  }

  if (category) {
    countQuery.andWhere('t.category', category);
  }

  if (priority) {
    countQuery.andWhere('t.priority', priority);
  }

  const totalResult = await countQuery.count({ total: 't.id' }).first();

  return { data, total: Number(totalResult?.total ?? 0) };
};

export const findTicketByCodeForCustomer = async (ticketCode, customerId, trx = db) => {
  return buildTicketQuery(trx)
    .clone()
    .where('t.ticket_code', ticketCode)
    .andWhere('t.user_id', customerId)
    .select(TICKET_COLUMNS)
    .first();
};

export const findTicketById = async (ticketId, trx = db) => {
  return buildTicketQuery(trx)
    .clone()
    .where('t.id', ticketId)
    .select(TICKET_COLUMNS)
    .first();
};

export const listTicketMessages = async (ticketId, trx = db) => {
  return buildMessageQuery(trx)
    .clone()
    .where('m.ticket_id', ticketId)
    .orderBy('m.created_at', 'asc')
    .select(MESSAGE_COLUMNS);
};

export const updateTicket = async (ticketId, changes, trx = db) => {
  return trx('support_tickets')
    .where({ id: ticketId })
    .update({ ...changes, updated_at: trx.fn.now() });
};