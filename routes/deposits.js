/*
 * GET Deposits.
 */

var db = require("../models");
var status = require("./resStatus");

var routes = {};
var method;

exports.list = function (req, res) {

    var depositId = req.query.id || req.params.id;

    Promise.resolve()
        .then(function () {
            if (depositId) {
                return db.Deposits.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { id: depositId }
                }); //if id is present
            } else {
                return db.Deposits.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } });
            }
        })
        .then(function (deposits) {
            if (deposits) {
                res.json(deposits);
            }
        })
        .catch(function (err) {
            console.log("Error at Deposit get request" + err);
        })
}

exports.add = function (req, res) {
    method = "saveDeposit";
    post(req, res, method);
}

exports.update = function (req, res) {
    method = "updateDeposit";
    post(req, res, method);
}

exports.delete = function (req, res) {
    method = "deleteDeposit";
    post(req, res, method);
}

function post(req, res, method) {
    var postData = Object.keys(req.query).length !== 0 ? req.query : Object.keys(req.body).length !== 0 ? req.body : null;
    var response;

    if (method == "findByStatus") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Deposits.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { status: postData.status }
                }); 
            })
            .then(function (deposits) {
                if (deposits) {
                    response.deposit = [];
                    deposits.forEach(function (deposit) {
                        response.deposit.push(deposit.dataValues);
                    });
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at findByStatus " + err);
            })
    } else if (method == "saveDeposit") {
        response = {};

        // building json for insert
        var entry = {
            amount: postData.amount,
            locationId: postData.locationId,
            accountId: postData.accountId,
            status: 0,
            cardId: postData.cardId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        Promise.resolve()
            .then(function () {
                return db.Deposits.create(entry);   //create a record
            })
            .then(function (deposit) {
                if (deposit) {
                    response.id = deposit.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at saveDeposit " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "updateDeposit") {
        response = {};

        //create a json
        var entry = {
            amount: postData.amount,
            locationId: postData.locationId,
            accountId: postData.accountId,
            status: postData.status,
            updatedAt: new Date()
        }

        Promise.resolve()
            .then(function () {
                return db.Deposits.update(entry, { where: { id: postData.id } }); //update a record with post request id
            })
            .then(function (deposit) {
                if (deposit) {
                    response.id = postData.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at updateDeposit " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "deleteDeposit") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Deposits.destroy({ where: { id: postData.id } }); //delete a record with post request id
            })
            .then(function (deposit) {
                if (deposit) {
                    response.id = postData.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at Deposit " + err);
                res.json({ status: status.EXCEPTION });
            })
    }
}