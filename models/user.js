"use strict";

module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define("users", {
        userid: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        paranoid: true,
    });

    return Users;
};