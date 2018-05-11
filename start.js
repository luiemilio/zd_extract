const writeToCsv = require('./util').writeToCsv;
const moment = require('moment');
const prompt = require('prompt');

const dates = {
	properties: {
		startDate: {
			description: 'Start Date (YYYY-MM-DD)',
			type: 'string',
			message: 'Incorrect format',
			required: true,
			conform: (value) => {
				return moment(value, 'YYYY-MM-DD', true).isValid();
			}

		},
		endDate: {
			description: 'End Date (YYYY-MM-DD)',
			type: 'string',
			message: 'Incorrect format',
			required: true,
			conform: (value) => {
				return moment(value, 'YYYY-MM-DD', true).isValid();
			}
		}
	}
};

prompt.message = '';

prompt.start();

prompt.get(dates, (err, result) => {
	const startDate = result.startDate;
	const endDate = result.endDate;
	writeToCsv(startDate, endDate);
});