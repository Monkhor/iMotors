const pool = require("../../config/database");

module.exports = {
    findAll: (callBack) => {
        try {
            pool.query(`
            SELECT
                A.ida,
                A.price,
                A.carMark,
                A.moneyType,
                A.buyTime,
                A.type,
                A.priceSell,
                A.moneyTypeSell,
                A.sellTime,
                A.id,
                GROUP_CONCAT(
                    CASE WHEN C.imageName IS NOT NULL THEN CONCAT('http://103.41.112.98:3000/upload/car/', C.imageName) ELSE '' END
                ) AS imageNames,
                SUM(CASE WHEN B.moneyType = 'Dollar' THEN B.price ELSE 0 END) AS priceCountDollar,
                SUM(CASE WHEN B.moneyType = 'Төгрөг' THEN B.price ELSE 0 END) AS priceCountTogrog
            FROM
                america_car AS A
            LEFT JOIN
                america_car_zardal AS B ON A.ida = B.ida
                LEFT JOIN car_image AS C ON C.ida = A.ida
            GROUP BY
                A.ida, A.price, A.carMark, A.moneyType, A.buyTime, A.type, A.priceSell, A.moneyTypeSell, A.sellTime, A.id`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
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
                (price,carMark,moneyType,buyTime,type,priceSell,moneyTypeSell,sellTime,id)
                VALUES(?,?,?,?,?,?,?,?,?)`, [
                data.price,
                data.carMark,
                data.moneyType,
                data.buyTime,
                data.type,
                data.priceSell,
                data.moneyTypeSell,
                data.sellTime,
                data.id
            ], (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                callBack(null, results.insertId);
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
        pool.query(
            `SELECT imageName FROM car_image WHERE ida = ?;`,
            [id],
            (error, results) => {
                if (error) {
                    console.error("Error executing query:", error);
                    return callBack && callBack(error);
                }
                callBack && callBack(null, results);
            }
        );
    },
    uploadImage: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO car_image(imageName,ida) VALUES(?,?)`,
                [data.imageName,
                data.ida],
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
};
