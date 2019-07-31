"use strict";

module.exports = function (sequelize, DataTypes) {
    var Deposits = sequelize.define("deposits", {
        locationId: DataTypes.STRING,
        accountId: DataTypes.STRING,
        amount: DataTypes.STRING,    
        status: DataTypes.INTEGER
    }, {
        paranoid: true,
    });

    return Deposits;
};