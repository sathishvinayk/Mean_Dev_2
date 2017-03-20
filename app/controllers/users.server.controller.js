// Invoke 'strict' JavaScript mode
'use strict';

// Load the 'User' Mongoose model
const User = require('mongoose').model('User');

// Create a new 'create' controller method
exports.create = (req, res, next)=> {
	// Create a new instance of the 'User' Mongoose model
	const user = new User(req.body);

	// Use the 'User' instance's 'save' method to save a new user document
	user.save((err)=>{
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(user);
		}
	});
};

// Create a new 'list' controller method
exports.list = (req, res, next)=> {
	// Use the 'User' static 'find' method to retrieve the list of users
	User.find({}, (err, users) =>{
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(users);
		}
	});
};

// Create a new 'read' controller method
exports.read = (req, res) =>{
	// Use the 'response' object to send a JSON response
	res.json(req.user);
};

// Create a new 'update' controller method
exports.update = (req, res, next) => {
	// Use the 'User' static 'findByIdAndUpdate' method to update a specific user
	User.findByIdAndUpdate(req.user.id, req.body, (err, user)=> {
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(user);
		}
	})
};

// Create a new 'delete' controller method
exports.delete = (req, res, next) =>{
	// Use the 'User' instance's 'remove' method to save a new user document
	req.user.remove((err) =>{
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Use the 'response' object to send a JSON response
			res.json(req.user);
		}
	})
};

// Create a new 'userByID' controller method
exports.userByID = (req, res, next, id)=>{
	// Use the 'User' static 'findOne' method to retrieve a specific user
	User.findOne({
		_id: id
	}, (err, user)=>{
		if (err) {
			// Call the next middleware with an error message
			return next(err);
		} else {
			// Set the 'req.user' property
			req.user = user;

			// Call the next middleware
			next();
		}
	});
};
