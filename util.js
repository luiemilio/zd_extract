const {
	getTicketsInRange,
	getMetrics,
	getUserFromId,
	getOrganizationFromId,
	getGroupFromId
} = require('./api');

const fs = require('fs');
const csvWriter = require('csv-write-stream');
const writer = csvWriter();

// original ticket columns: 
// id, created_at, updated_at, type, priority, status, 
// requester_id, submitter_id, organization_id, group_id, tags 

// ticket metric columns:
// group_stations, assignee_stations, replies, assignee_updated_at, 
// requester_updated_at, status_updated_at, initially_updated_at, assigned_at, 
// solved_at, first_resolution_time_in_minutes, reply_time_in_minutes

const ticketColumns = [
	'id', 'type', 'priority', 'status', 'from', 'requester_id',
	'submitter_id', 'group_id', 'organization_id', 'tags', 'created_at',
	'updated_at', 'group_stations', 'assignee_stations', 'replies',
	'assignee_updated_at', 'requester_update_at', 'status_updated_at',
	'initially_assigned_at', 'assigned_at', 'solved_at',
	'first_resolution_time_in_minutes', 'reply_time_in_minutes'
];

async function filterTicket(ticket) {
	let filteredTicket = ticket;
	const columns = Object.keys(ticket);
	const columnsToFormat = ['requester_id', 'submitter_id', 'organization_id', 'group_id'];
	for (let index = 0; index < columns.length; index++) {
		const column = columns[index];
		if (columnsToFormat.includes(column) && filteredTicket[column] != null) {
			filteredTicket[column] = await idToName(filteredTicket[column], column);
		}
		if (!ticketColumns.includes(column)) delete filteredTicket[column];
	}
	return filteredTicket;
}

async function idToName(id, column) {
	let result;
	switch (column) {
		case 'requester_id':
			result = await getUserFromId(id);
			break;
		case 'submitter_id':
			result = await getUserFromId(id);
			break;
		case 'organization_id':
			result = await getOrganizationFromId(id);
			break;
		case 'group_id':
			result = await getGroupFromId(id);
			break;
	}
	return result;
}

async function addMetrics(ticket) {
	const metrics = await getMetrics(ticket.id);
	let ticketWithMetric = ticket;
	const columns = Object.keys(metrics);

	columns.forEach((column) => {
		if (ticketColumns.includes(column) && column != 'id') {
			if (column === 'reply_time_in_minutes' || column === 'first_resolution_time_in_minutes') {
				ticketWithMetric[column] = metrics[column].calendar;
			} else {
				ticketWithMetric[column] = metrics[column];
			}
		}
	});

	return ticketWithMetric;
}

async function getTickets(startDate, endDate) {
	const tickets = await getTicketsInRange(startDate, endDate);
	let allTickets = [];

	for (let index = 0; index < tickets.length; index++) {
		const filteredTicket = await filterTicket(tickets[index]);
		const ticketWithMetrics = await addMetrics(filteredTicket);
		allTickets.push(ticketWithMetrics);
	}

	return allTickets;
}

async function writeToCsv(fromDate, toDate) {
	console.log('fetching tickets...');
	const tickets = await getTickets(fromDate, toDate);
	const ranNum = (Math.floor(Math.random() * Math.floor(999999999999999999999)));
	console.log('writing csv...');
	writer.pipe(fs.createWriteStream(`${ranNum}.csv`));

	for (let index = 0; index < tickets.length; index++) {
		const ticket = tickets[index];
		await writer.write(ticket);
	}

	writer.end();
	console.log(`csv ready... name: ${ranNum}.csv`);

	return `${ranNum}.csv`;
}

writeToCsv('2018-05-02', '2018-05-03');

module.exports = {
	writeToCsv: writeToCsv
};