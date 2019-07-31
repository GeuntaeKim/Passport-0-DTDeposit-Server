"use strict";

module.exports = function (sequelize, DataTypes) {
    var Cards = sequelize.define("cards", {
        cardNumber: DataTypes.STRING(16),
        name: DataTypes.STRING,
        locationId: DataTypes.STRING,
        accountId: DataTypes.STRING
    }, {
        paranoid: true,
    });

    return Cards;
};