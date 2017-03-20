// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
const	config = require('./config'),
	mongoose = require('mongoose');

// Define the Mongoose configuration method
module.exports = ()=>{
	// Use Mongoose to connect to MongoDB
	const db = mongoose.connect(config.db);

	// Load the 'User' model
	require('../app/models/user.server.model');

	// Return the Mongoose connection instance
	return db;
};
