/*
 * GET Items.
 */

var db = require("../models");
var status = require("./resStatus");
var FileReader = require("filereader");

var routes = {};
var method;

exports.list = function (req, res) {

    var itemId = req.query.id || req.params.id;

    Promise.resolve()
        .then(function () {
            if (itemId) {
                return db.Items.findAll({
                    attributes: { exclude: ['frontImage','rearImage','createdAt', 'updatedAt', 'deletedAt'] },
                    where: { id: itemId }
                }); //if id is present
            } else {
                return db.Items.findAll({ attributes: { exclude: ['frontImage','rearImage','createdAt', 'updatedAt', 'deletedAt'] } });
            }
        })
        .then(function (items) {
            if (items) {
                res.json(items);
            }
        })
        .catch(function (err) {
            console.log("Error at Item get request" + err);
        })
}

exports.add = function (req, res) {
    method = "saveItem";
    post(req, res, method);
}

exports.update = function (req, res) {
    method = "updateItem";
    post(req, res, method);
}

exports.delete = function (req, res) {
    method = "deleteItem";
    post(req, res, method);
}

exports.image = function (req, res) {
    method = "getImage";
    post(req, res, method);
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

function post(req, res, method) {
    var postData = Object.keys(req.query).length !== 0 ? req.query : Object.keys(req.body).length !== 0 ? req.body : null;
    var response;

    if (method == "getImage") {
        response = {};
        Promise.resolve()
            .then(function () {
                console.log(postData);
                return db.Items.findAll({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    where: { id: postData.id }
                }); //if id is present
            })
            .then(async function (items) {
                if (items) {
                    await sleep(2000);
                    console.log(items);
                    res.json(items[0].frontImage);
                    console.log('item[0]');
                    console.log(items[0]);
                    console.log('items[0].frontImage');
                    console.log(items[0].frontImage);
                    var reader = new FileReader();
                    //reader.readAsBinaryString(items[0].frontImage);
                    //reader.readAsArrayBuffer(items[0].frontImage);
                    var data = [];
                    reader.on('data', function(chunk) {
                        data.push(chunk);
                        console.log("size" + data.length);
                    })
                    //reader.addEventListener('load', function(ev) {
                    //    console.log("size" + ev.target.result.length);
                    //s})
                    reader.onloadend = function() {
                        base64data = datas;
                        console.log('Base64');
                        console.log(base64data);
                    }
                }
            })
            .catch(function (err) {
                console.log("Error at Item get request" + err);
            })
    }
    else if (method == "saveItem") {
        response = {};

        // building json for insert
        var entry = {
            amount: postData.amount,
            micr: postData.micr,
            frontImage: postData.frontImage,
            rearImage: postData.rearImage,
            depositId: postData.depositId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        Promise.resolve()
            .then(function () {
                return db.Items.create(entry);   //create a record
            })
            .then(function (item) {
                if (item) {
                    response.id = item.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at saveItem " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "updateItem") {
        response = {};

        //create a json
        var entry = {
            amount: postData.amount,
            micr: postData.micr,
            frontImage: postData.frontImage,
            rearImage: postData.rearImage,
            depositId: postData.depositId,
            updatedAt: new Date()
        }

        Promise.resolve()
            .then(function () {
                return db.Items.update(entry, { where: { id: postData.id } }); //update a record with post request id
            })
            .then(function (item) {
                if (item) {
                    response.id = postData.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at updateItem " + err);
                res.json({ status: status.EXCEPTION });
            })
    } else if (method == "deleteItem") {
        response = {};
        Promise.resolve()
            .then(function () {
                return db.Items.destroy({ where: { id: postData.id } }); //delete a record with post request id
            })
            .then(function (item) {
                if (item) {
                    response.id = postData.id;
                }
                response.status = status.SUCCESS;
                res.json(response);
            })
            .catch(function (err) {
                console.log("Error at Item " + err);
                res.json({ status: status.EXCEPTION });
            })
    }
}