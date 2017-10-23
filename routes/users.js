const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken')

const config = require('../config/database');
const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {

	let newUser = new User({
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, function (err, user) {
		if (err) {
			res.json({ success: false, message: "Failed to register user" });
		} else {

			User.getUserByUsername(newUser.username, (err, user) => {
				if (err) throw err;
				if (!user) {
					return res.json({ "success": false, "message": "Something went wrong!" });
				}
			});

			const token = jwt.sign(user, config.secret, {
				expiresIn: 604800 // 1 week
			});

			res.json({
				success: true,
				token: 'JWT ' + token,
				user: {
					id: user._id,
					username: user.username
				}
			});

		}
	});

});

router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ "success": false, "message": "User not found" });
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;

			if (isMatch) {
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						username: user.username
					}
				});
			} else {
				return res.json({ "success": false, "message": "Wrong Credentials!" });
			}
		});

	});

});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	res.json({ user: req.user });
});

// Change Profile data
router.put('/edit', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.editUser(req.body.user._id, req.body.user, (err, user) => {
		console.log(user);
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				user: user
			});
		}
	});
});

// Get List of a user
router.get('/getUserList', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.getListByUserId(req.user._id, (err, user) => {
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				list: user.list
			});
		}
	});
});

// Get all others List
router.get('/othersList', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.getOthersList(req.user._id, (err, users) => {
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				users: users
			});
		}
	});
});

// Add in List
router.post('/additem', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.addItem(req.user._id, req.body.item, (err, data) => {
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				data: data
			});
		}
	});
});


// Delete an Item
router.delete('/deleteItem/:id', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	User.deleteItem(req.user._id, req.params.id, (err, data) => {
		if (err) {
			res.json({
				status: false,
				message: 'There was some error. ' + err
			});
		} else {
			res.json({
				status: true,
				data: data
			});
		}
	});
});




module.exports = router;
