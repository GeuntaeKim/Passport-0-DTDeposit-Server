/*
 * GET Users.
 */

var db = require("../models");
var status = require("./resStatus");

var routes = {};
var method;

exports.list = function (req, res) {

    var userId = req.query.id || req.params.id;

    Promise.resolve()
        .then(function () {
            if (userId) {
                return db.Users.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { userId: userId }
                }); //if id is present
            } else {
                return db.Users.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } });
            }
        })
        .then(function (users) {
            if (users) {
                res.json(users);
            }
        })
        .catch(function (err) {
            console.log("Error at User get request" + err);
        })
}

exports.add = function (req, res) {
    method = "saveUser";
    post(req, res, method);
}

exports.update = function (req, res) {
    method = "updateUser";
    post(req, res, method);
}

exports.delete = function (req, res) {
    method = "deleteUser";
    post(req, res, method);
}

function post(req, res, method) {
    var postData = Object.keys(req.query).length !== 0 ? req.query : Object.keys(req.body).length !== 0 ? req.body : null;
    var response;

    if (method == "findByUserId") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Users.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { userId: { $like: "%" + postData.userId + "%" } }
                }); 
            })
            .then(function (users) {
                if (users) {
                    response.user = [];
                    users.forEach(function (user) {
                        response.user.push(user.dataValues);
                    });
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at findByUserId " + err);
            })
    } else if (method == "saveUser") {
        response = {};

        // building json for insert
        var entry = {
            userId: postData.userId,
            password: postData.password,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        Promise.resolve()
            .then(function () {
                return db.Users.create(entry);   //create a record
            })
            .then(function (user) {
                if (user) {
                    response.userId = user.userId;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at saveUser " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "updateUser") {
        response = {};

        //create a json
        var entry = {
            userId: postData.userId,
            password: postData.password,
            updatedAt: new Date()
        }

        Promise.resolve()
            .then(function () {
                return db.Users.update(entry, { where: { id: postData.id } }); //update a record with post request id
            })
            .then(function (user) {
                if (user) {
                    response.userId = postData.userId;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at updateUser " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "deleteUser") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Users.destroy({ where: { id: postData.id } }); //delete a record with post request id
            })
            .then(function (user) {
                if (user) {
                    response.userId = postData.userId;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at User " + err);
                res.json({ status: status.EXCEPTION });
            })
    }
}
