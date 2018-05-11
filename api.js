const https = require('https');
const querystring = require('querystring');

const {
	email,
	token
} = require('./config');

const options = {
	host: 'openfin.zendesk.com',
	headers: {
		'Authorization': 'Basic ' + new Buffer(email + '/' + token).toString('base64'),
	}
};

async function getTicketsInRange(startDate, endDate) {
	return new Promise((resolve, reject) => {
		options.path = encodeURI(`/api/v2/search.json?query=created>=${startDate} created<=${endDate} type:ticket`);

		https.get(options, (res) => {
			let body = "";

			res.on('data', (data) => {
				body += data;
			});

			res.on('end', () => {
				resolve(JSON.parse(body).results);
			});

			res.on('error', (e) => {
				reject(console.log("Got error: " + e.message));
			});
		});
	});
}

// getTicketsInRange('2018-02-28', '2018-02-28').then(t => console.log(t));

async function getMetrics(ticketId) {
	return new Promise((resolve, reject) => {
		options.path = encodeURI(`/api/v2/tickets/${ticketId}/metrics.json`);

		https.get(options, (res) => {
			let body = "";

			res.on('data', (data) => {
				body += data;
			});

			res.on('end', () => {
				resolve(JSON.parse(body).ticket_metric);
			});

			res.on('error', (e) => {
				reject(console.log("Got error: " + e.message));
			});
		});
	});
}

// getMetrics('5309').then(t => console.log(t));

async function getUserFromId(userId) {
	return new Promise((resolve, reject) => {
		options.path = encodeURI(`/api/v2/users/${userId}.json`);

		https.get(options, (res) => {
			let body = "";

			res.on('data', (data) => {
				body += data;
			});

			res.on('end', () => {
				resolve(JSON.parse(body).user.name);
			});

			res.on('error', (e) => {
				reject(console.log("Got error: " + e.message));
			});
		});
	});
}

// getUserFromId(6924572986).then(u => console.log(u));

async function getOrganizationFromId(organizationId) {
	return new Promise((resolve, reject) => {
		options.path = encodeURI(`/api/v2/organizations/${organizationId}.json`);

		https.get(options, (res) => {
			let body = "";

			res.on('data', (data) => {
				body += data;
			});

			res.on('end', () => {
				resolve(JSON.parse(body).organization.name);
			});

			res.on('error', (e) => {
				reject(console.log("Got error: " + e.message));
			});
		});
	});
}

// getOrganizationFromId(32107417).then(o => console.log(o));

async function getGroupFromId(groupId) {
	return new Promise((resolve, reject) => {
		options.path = encodeURI(`/api/v2/groups/${groupId}.json`);

		https.get(options, (res) => {
			let body = "";

			res.on('data', (data) => {
				body += data;
			});

			res.on('end', () => {
				resolve(JSON.parse(body).group.name);
			});

			res.on('error', (e) => {
				reject(console.log("Got error: " + e.message));
			});
		});
	});
}

// getGroupFromId(21441863).then(g => console.log(g));

module.exports = {
	getTicketsInRange: getTicketsInRange,
	getMetrics: getMetrics,
	getUserFromId: getUserFromId,
	getOrganizationFromId: getOrganizationFromId,
	getGroupFromId: getGroupFromId
};