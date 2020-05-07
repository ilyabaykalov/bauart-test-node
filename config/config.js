const options = {
	promiseLib: require('bluebird')
};

const pgp = require('pg-promise')(options);

pgp.pg.types.setTypeParser(1114, function (stringValue) {
	console.log(stringValue);
	return new Date(Date.parse(stringValue + '+0000'));
});

const config = {
	host: 'localhost',
	port: 5432,
	database: 'journal',
	user: 'postgres',
	password: 'root'
};

const db = pgp(config);

module.exports = { pgp, db };
