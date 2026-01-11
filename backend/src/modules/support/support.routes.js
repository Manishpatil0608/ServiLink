import { Router } from 'express';
import { authGuard } from '../../middleware/authGuard.js';
import { validate } from '../../middleware/validate.js';
import {
	createTicketValidator,
	listTicketsValidator,
	ticketParamsValidator,
	createMessageValidator
} from './support.validator.js';
import {
	handleCreateSupportTicket,
	handleListCustomerTickets,
	handleGetCustomerTicket,
	handleAddCustomerTicketMessage
} from './support.controller.js';

const router = Router();

router.post(
	'/tickets',
	authGuard(['customer']),
	validate(createTicketValidator),
	handleCreateSupportTicket
);

router.get(
	'/tickets',
	authGuard(['customer']),
	validate(listTicketsValidator),
	handleListCustomerTickets
);

router.get(
	'/tickets/:ticketCode',
	authGuard(['customer']),
	validate(ticketParamsValidator),
	handleGetCustomerTicket
);

router.post(
	'/tickets/:ticketCode/messages',
	authGuard(['customer']),
	validate({ ...ticketParamsValidator, ...createMessageValidator }),
	handleAddCustomerTicketMessage
);

export default router;
