"use strict";

module.exports = function (sequelize, DataTypes) {
    var Items = sequelize.define("items", {
        amount: DataTypes.STRING,
        micr: DataTypes.STRING,
        frontImage: DataTypes.BLOB('long'),
        rearImage: DataTypes.BLOB('long')
    }, {
        paranoid: true,
    });

    return Items;
};