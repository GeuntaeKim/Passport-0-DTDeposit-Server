/*
 * GET Cards.
 */

var db = require("../models");
var status = require("./resStatus");

var routes = {};
var method;

exports.list = function (req, res) {

    var cardId = req.query.id || req.params.id;

    Promise.resolve()
        .then(function () {
            if (cardId) {
                return db.Cards.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { id: cardId }
                }); //if id is present
            } else {
                return db.Cards.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } });
            }
        })
        .then(function (cards) {
            if (cards) {
                res.json(cards);
            }
        })
        .catch(function (err) {
            console.log("Error at Card get request" + err);
        })
}

exports.add = function (req, res) {
    method = "saveCard";
    post(req, res, method);
}

exports.update = function (req, res) {
    method = "updateCard";
    post(req, res, method);
}

exports.delete = function (req, res) {
    method = "deleteCard";
    post(req, res, method);
}

function post(req, res, method) {
    var postData = Object.keys(req.query).length !== 0 ? req.query : Object.keys(req.body).length !== 0 ? req.body : null;
    var response;

    if (method == "findByCardNumber") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Cards.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { cardNumber: { $like: "%" + postData.cardNumber + "%" } }
                }); 
            })
            .then(function (cards) {
                if (cards) {
                    response.card = [];
                    cards.forEach(function (card) {
                        response.card.push(card.dataValues);
                    });
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at findByCardNumber " + err);
            })
    } else if (method == "saveCard") {
        response = {};

        // building json for insert
        var entry = {
            cardNumber: postData.cardNumber,
            name: postData.name,
            locationId: postData.locationId,
            accountId: postData.accountId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        Promise.resolve()
            .then(function () {
                return db.Cards.create(entry);   //create a record
            })
            .then(function (card) {
                if (card) {
                    response.cardNumber = card.cardNumber;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at saveCard " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "updateCard") {
        response = {};

        //create a json
        var entry = {
            cardNumber: postData.cardNumber,
            name: postData.name,
            locationId: postData.locationId,
            accountId: postData.accountId,
            updatedAt: new Date()
        }

        Promise.resolve()
            .then(function () {
                return db.Cards.update(entry, { where: { id: postData.id } }); //update a record with post request id
            })
            .then(function (card) {
                if (card) {
                    response.cardNumber = postData.cardNumber;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at updateCard " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "deleteCard") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Cards.destroy({ where: { id: postData.id } }); //delete a record with post request id
            })
            .then(function (card) {
                if (card) {
                    response.cardNumber = postData.cardNumber;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at Card " + err);
                res.json({ status: status.EXCEPTION });
            })
    }
}
