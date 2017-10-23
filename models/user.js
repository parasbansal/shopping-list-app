const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');

// List Schema
const ListSchema = mongoose.Schema({
	item: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	}
});

// User Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	list: {
		type: [ListSchema],
		default: null
	},
	created_at: {
		type: Date,
		required: true,
		default: Date.now
	}
});


const List = mongoose.model('List', ListSchema);
const User = module.exports = mongoose.model('User', UserSchema);

// Get user by ID
module.exports.getUserById = function (id, callback) {
	User.findById(id).select('-list').exec(callback);
}

// Get user by Username
module.exports.getUserByUsername = function (username, callback) {
	const query = { username: username }
	User.findOne(query).select('-list').exec(callback);
}

// Get user details without password
module.exports.getUserByIdProtected = function (id, callback) {
	User.findById(id).select('-password').exec(callback);
}


module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			if (err) throw err;

			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.comparePassword = function (password, actualPassword, callback) {
	bcrypt.compare(password, actualPassword, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
}

// Change Profile
module.exports.editUser = function (id, newUser, callback) {
	User.findByIdAndUpdate(id, newUser, callback);
}


// List Functions

// Get List By User Id
module.exports.getListByUserId = function (userId, callback) {
	User.findById(userId).select('list').exec(callback);
}

// Get All others list
module.exports.getOthersList = function (userId, callback) {
	const query = { '_id': { $ne: userId } };
	User.find(query).select('username list').exec(callback);
}

// Add Item to the list
module.exports.addItem = function (userId, newItem, callback) {

	let newListItem = new List({
		item: newItem
	});

	User.update(
		{ _id: userId },
		{
			$push: {
				'list': newListItem
			}
		},
		{ upsert: true },
		callback
	);
}

// Delete an Item
module.exports.deleteItem = function (userId, itemId, callback) {
	User.findByIdAndUpdate(userId, {
		'$pull': {
			'list': { '_id': itemId }
		}
	}).exec(callback);
}

