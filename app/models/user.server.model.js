// Invoke 'strict' JavaScript mode
'use strict';

// Load the Mongoose module and Schema object
const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'UserSchema'
const UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		// Set an email index
		index: true,
		// Validate the email format
		match: /.+\@.+\..+/
	},
	username: {
		type: String,
		// Trim the 'username' field
		trim: true,
		// Set a unique 'username' index
		unique: true,
		// Validate 'username' value existance
		required: true
	},
	password: {
		type: String,
		// Validate the 'password' value length
		validate: [
			(password)=>{
				return password.length >= 6;
			},
			'Password Should Be Longer'
		]
	},
	salt: {
		type:String
	},
	provider:{
		type:String,
		required: 'Provider is required'
	},
	providerId: String,
	providerData: {},
	website: {
		type: String,
		// Use a setter property to validate protocol existance in 'website' field
		set: (url) =>{
			if (!url) {
				return url;
			} else {
				if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
					url = 'http://' + url;
				}

				return url;
			}
		}
	},
	role: {
		type: String,
		// Validate the 'role' value using enum list
		enum: ['Admin', 'Owner', 'User']
	},
	created: {
		type: Date,
		// Create a default 'created' value
		default: Date.now
	}
});

// Set the 'fullname' virtual property
UserSchema.virtual('fullName').get(()=> {
	return this.firstName + ' ' + this.lastName;
}).set((fullName)=>{
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

UserSchema.pre('save',function(next){
	if(this.password){
		this.salt=new Buffer(crypto.randomBytes(16).toString('base64'),'base64');
		this.password=this.hashPassword(this.password);
	}
	next();
});

UserSchema.methods.hashPassword=function(password){
	return crypto.pbkdf2Sync(password,this.salt,10000,64).toString('base64');
};

UserSchema.methods.authenticate=function(password){
	return this.password===this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername=function(username,suffix,callback){
	let possibleUsername=username+(suffix || '');
	this.findOne({
		username:possibleUsername
	}, (err,user)=>{
		if(!err){
			if(!user){
				callback(possibleUsername);
			}else {
				return this.findUniqueUsername(username,(suffix || 0)+1,callback);
			}
		}else {
			callback(null);
		}
	});
}
// Create the 'findOneByUsername' static method
UserSchema.statics.findOneByUsername = (username, callback)=>{
	// Use the 'findOne' method to retrieve a user document
	this.findOne({
		username: new RegExp(username, 'i')
	}, callback);
};

// Create the 'authenticate' instance method
UserSchema.methods.authenticate = (password)=> {
	return this.password === password;
};

// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
UserSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Create the 'User' model out of the 'UserSchema'
mongoose.model('User', UserSchema);
