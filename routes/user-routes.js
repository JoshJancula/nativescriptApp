const db = require("../models");
const JancstaPort = require('../config/jancsta');
const bcrypt = require('bcryptjs');
const moment = require('moment');

// Routes
// =============================================================
module.exports = (app) => {

	// GET route for getting all users
	app.get("/api/users", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.findAll({
				}).then((x) => {
					let z = [];
					x.forEach(y => {
						const user = {
							Username: y.Username,
							FirstName: y.FirstName,
							LastName: y.LastName,
							Phone: y.Phone,
							Email: y.Email,
							Role: y.Role,
							id: y.id,
							Active: y.Active,
							Avatar: y.Avatar,
						}
						z.push(user);
					});
					res.json(z);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// GET route for retrieving users by franchise
	app.get("/api/users/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.findAll({
				}).then((x) => {
					let z = [];
					x.forEach(y => {
						const user = {
							Username: y.Username,
							FirstName: y.FirstName,
							LastName: y.LastName,
							Phone: y.Phone,
							Email: y.Email,
							Role: y.Role,
							id: y.id,
							Active: y.Active,
							Avatar: y.Avatar,
						}
						z.push(user);
					});
					res.json(z);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// PUT route for updating users
	app.put("/api/users/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.update({
					FirstName: req.body.FirstName,
					LastName: req.body.LastName,
					Phone: req.body.Phone,
					Role: req.body.Role,
					Active: req.body.Active,
				}, {
						where: {
							id: req.body.id
						}
					}).then((x) => {
						res.json(x);
					})
					.catch((err) => {
						res.json(err);
					});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// PUT route for updating users
	app.put("/api/users/avatar/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.update({
					Avatar: req.body.Avatar,
				}, {
						where: {
							id: req.body.id
						}
					}).then((x) => {
						res.json(x);
					})
					.catch((err) => {
						res.json(err);
					});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// PUT route for updating user password
	app.put("/api/users/updatePassword/:id", (req, res) => {
		let pwd = bcrypt.hashSync(req.body.Password, bcrypt.genSaltSync(2), null);
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.update({
					Password: pwd,
				}, {
						where: {
							id: req.body.id
						}
					}).then((x) => {
						res.status(200).send({ success: true, msg: 'Success' });
					})
					.catch((err) => {
						res.json(err);
						console.log('err: ', err);
					});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// POST route for saving a new user
	app.post("/api/users", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.create(req.body).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	// DELETE route for deleting a user 
	app.delete("/api/users/:id", (req, res) => {
		new JancstaPort(req.headers.authorization.toString()).then((bool) => {
			if (bool == true) {
				db.GameUser.destroy({
					where: {
						id: req.params.id
					}
				}).then((x) => {
					res.json(x);
				});
			} else {
				res.status(401).send({ success: false, msg: 'Unauthorized, GTFO' });
			}
		});
	});

	app.post('/api/signin', (req, res) => {
		db.GameUser.findOne({
			where: {
				Username: req.body.Username
			},
		}).done((user, err) => {
			if (err) throw err;
			if (!user) {
				res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
			} else {
				const pwd = user.dataValues.Password
				const returnInfo = {
					Username: user.dataValues.Username,
					FirstName: user.dataValues.FirstName,
					LastName: user.dataValues.LastName,
					FranchiseId: user.dataValues.FranchiseId,
					Phone: user.dataValues.Phone,
					Email: user.dataValues.Email,
					Role: user.dataValues.Role,
					createdAt: user.dataValues.createdAt,
					id: user.dataValues.id,
					Avatar: user.dataValues.Avatar,
				}
				if (user.dataValues.Active == false) {
					res.status(403).send({ success: false, msg: `Authentication failed. You're account has been deactivated.` })
				} else {
					// check if password matches
					bcrypt.compare(req.body.Password, pwd, (err, isMatch) => {
						if (isMatch && !err) {
							// if user is found and password is right create a token
							let date = moment(new Date().toISOString()).format('MM/DD/YYYY');
							let hashThis = `${date}secret`
							bcrypt.genSalt(1, (err, salt) => {
								bcrypt.hash(hashThis, salt, (err2, hash) => {
									res.json({ success: true, token: hash, user: returnInfo });
								});
							});
						} else {
							res.status(401).send({ success: false, msg: 'Authentication failed. Invalid password.' });
						}
					});
				}
			}
		});
	});

};