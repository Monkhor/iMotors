const pool = require("../../config/database");

module.exports = {
    findAll: (callBack) => {
        try {
            pool.query(`
            SELECT
                a.ida,
                a.price,
                a.carMark,
                a.moneyType,
                a.buyTime,
                a.imageName,
                a.type,
                a.priceSell,
                a.moneyTypeSell,
                a.sellTime,
                a.id,
                CASE WHEN a.imageName != '' THEN  CONCAT('http://128.199.78.191:3000/upload/car/',a.imageName) ELSE '' END AS imageName,
                SUM(CASE WHEN z.moneyType = 'Dollar' THEN z.price ELSE 0 END) AS priceCountDollar,
                SUM(CASE WHEN z.moneyType = 'Төгрөг' THEN z.price ELSE 0 END) AS priceCountTogrog
            FROM
                america_car AS a
            LEFT JOIN
                america_car_zardal AS z ON a.ida = z.ida
            GROUP BY
                a.ida, a.price, a.carMark, a.moneyType, a.buyTime, a.imageName, a.type, a.priceSell, a.moneyTypeSell, a.sellTime, a.id;
            `,
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    },
    editCar: (data, callBack) => {
        try {
            pool.query(
                `UPDATE america_car SET buyTime = ?, price = ?,carMark = ?,moneyType = ?
                WHERE ida = ?`,
                [data.buyTime, data.price, data.carMark, data.moneyType, data.ida]
                ,
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    sellCar: (data, callBack) => {
        try {
            pool.query(
                `UPDATE america_car SET type = ?,priceSell = ?,moneyTypeSell = ?,sellTime = ?
                WHERE ida = ?`,
                [data.type, data.priceSell, data.moneyTypeSell, data.sellTime, data.ida]
                ,
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    create: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO america_car
                (price,carMark,moneyType,buyTime,imageName,type,priceSell,moneyTypeSell,sellTime,id)
                VALUES(?,?,?,?,?,?,?,?,?,?)`, [
                data.price,
                data.carMark,
                data.moneyType,
                data.buyTime,
                data.imageName,
                data.type,
                data.priceSell,
                data.moneyTypeSell,
                data.sellTime,
                data.id
            ], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                callBack(null, results);
            }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    zarlaga: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO america_car_zardal
                (price,moneyType,zardalTime,description,ida)
                VALUES(?,?,?,?,?)`, [
                data.price,
                data.moneyType,
                data.zardalTime,
                data.description,
                data.ida
            ], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                callBack(null, results);
            }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    getZarlaga: (id, callBack) => {
        try {
            pool.query(
                `SELECT * FROM america_car_zardal WHERE ida =?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    },
    deleteCar: (id, callBack) => {
        try {
            pool.query(
                `DELETE FROM america_car
                 WHERE ida = ?;`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    },
    getByIdCar: (id, callBack) => {
        try {
            pool.query(
                `SELECT imageName FROM america_car
                 WHERE ida = ?;`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    }
};
