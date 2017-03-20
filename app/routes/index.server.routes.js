// Invoke 'strict' JavaScript mode
'use strict';

// Define the routes module' method
module.exports = (app)=> {
	// Load the 'index' controller
	const index = require('../controllers/index.server.controller');

	// Mount the 'index' controller's 'render' method
	app.get('/', index.render);
};
