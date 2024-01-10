const pool = require("../../config/database");

module.exports = {
    getByIdTrent: (id, callBack) => {
        pool.query(
            `SELECT imageName FROM house_image WHERE idt = ?;`,
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
    getAll: (callBack) => {
        try {
            pool.query(
                `SELECT * FROM house`,
                (error, results) => {
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
    getDetialData: (callBack) => {
        try {
            pool.query(
                `SELECT A.idh, A.paymentDate, A.monthDate,C.isLeft,
                SUM(A.price) AS allPrice,
                SUM(A.underPayment) AS under,
                CASE WHEN (C.isLeft = 0 OR C.isLeft IS NULL) AND B.type = 0 THEN 3 ELSE B.type END AS isOn,
                CASE WHEN SUM(A.underPayment) != 0 THEN 2 ELSE B.type END AS lastType,
                CASE WHEN SUM(A.underPayment) != 0
                          AND YEAR(NOW()) = YEAR(A.monthDate) AND MONTH(NOW()) = MONTH(A.monthDate) THEN 1 ELSE 0 END AS underPaymentType,
                CASE WHEN YEAR(NOW()) = YEAR(A.monthDate) AND MONTH(NOW()) = MONTH(A.monthDate) THEN 0 ELSE 1 END AS otp,
                CASE WHEN (C.isLeft = 0 OR C.isLeft IS NULL)
                          AND YEAR(DATE_ADD(C.trentDate, INTERVAL C.getTime MONTH)) = YEAR(NOW())
                          AND MONTH(DATE_ADD(C.trentDate, INTERVAL C.getTime MONTH)) = MONTH(NOW()) THEN 1 ELSE 0 END AS monthStatus,
                DATE_ADD(C.trentDate, INTERVAL C.getTime MONTH) AS month,
                MAX(A.monthDate) AS lastMonth
            FROM house_month A
            LEFT JOIN house B ON B.idh = A.idh
            LEFT JOIN house_trent C ON C.idt = A.idt AND C.idh = A.idh
            GROUP BY A.idh, A.idt, A.paymentDate, A.monthDate
            ORDER BY A.paymentDate`,
                (error, results) => {
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
    createHouse: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO house(address,type) VALUES(?,?)`,
                [data.address,
                data.type], (error, results) => {
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
    deleteHouse: (id, callBack) => {
        try {
            pool.query(
                `DELETE FROM house WHERE idh = ?;`,
                [id],
                (error, results) => {
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
    editHouse: (data, callBack) => {
        try {
            pool.query(
                `UPDATE house SET address = ?, type = ? WHERE idh = ?`,
                [data.address, data.type, data.idh],
                (error, results) => {
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
    getTrent: (id, callBack) => {
        try {
            pool.query(
                `SELECT a.*, GROUP_CONCAT(
                    CASE WHEN b.imageName IS NOT NULL THEN CONCAT('http://103.41.112.98:3000/upload/', b.imageName) ELSE '' END
                ) AS imageNames
                FROM house_trent a
                LEFT JOIN house_image b ON b.idt = a.idt AND b.idh = a.idh
                WHERE a.idh = ?
                GROUP BY a.idt, a.idh`,
                [id],
                (error, results) => {
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
    createTrent: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO house_trent(price,trentDate,paymentPrice,baritsaa,getTime,userPhone,userName,idh) VALUES(?,?,?,?,?,?,?,?)`,
                [data.price, data.trentDate, data.paymentPrice, data.baritsaa, data.getTime, data.userPhone, data.userName, data.idh],
                (error, result) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null, result.insertId);
                }
            );
        } catch (error) {
            console.log(error);
            return callBack(error);
        }
    },
    createMonthPayment: (data, callBack) => {
        try {
            pool.query(
                'INSERT INTO house_month(monthDate, price, underpayment, type, paymentDate, idt, idh, isUpdate) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
                [data.monthDate, data.price, data.underpayment, data.type, data.paymentDate, data.idt, data.idh],
                (error, results) => {
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
    createMonthNoUpdatePayment: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO house_month(monthDate,price,underpayment,type,paymentDate,idt,idh,isUpdate) VALUES(?,?,?,?,?,?,?,1)`,
                [data.monthDate, data.price, data.underpayment, data.type, data.paymentDate, data.idt, data.idh],
                (error, results) => {
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
    uploadImage: (data, callBack) => {
        try {
            pool.query(
                `INSERT INTO house_image(imageName,idt,idh) VALUES(?,?,?)`,
                [data.imageName,
                data.idt,
                data.idh],
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
    deleteTrent: (id, callBack) => {
        try {
            pool.query(
                `DELETE FROM house_trent WHERE idt = ?;`,
                [id],
                (error, results) => {
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
    editTrent: (data, callBack) => {
        try {
            pool.query(
                `UPDATE house_trent SET price = ?, trentDate = ?, paymentPrice = ?, baritsaa = ?, getTime = ?, userPhone = ?, userName = ? WHERE idt = ? AND idh = ?`,
                [data.price, data.trentDate, data.paymentPrice, data.baritsaa, data.getTime, data.userPhone, data.userName, data.idt, data.idh],
                (error, results) => {
                    if (error) {
                        console.log(error);
                        return callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    deleteMonth: (data, callBack) => {
        try {
            pool.query(
                `DELETE FROM house_month WHERE idh = ? AND idt = ?`,
                [data.idh, data.idt],
                (error, results) => {
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
    deleteUpdateMonth: (data, callBack) => {
        try {
            pool.query(
                `DELETE FROM house_month WHERE idh = ? AND idt = ? AND isUpdate = 0`,
                [data.idh, data.idt],
                (error, results) => {
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
    editMonth: (data, callBack) => {
        try {
            pool.query(
                `UPDATE house_month SET monthDate  = ?, underPayment = ?, paymentDate = ?, price = ?, type = ? WHERE houseMonthId = ?`,
                [data.monthDate, data.underPayment, data.paymentDate, data.price, data.type, data.houseMonthId],
                (error, results) => {
                    if (error) {
                        return callBack(error);
                    }
                    callBack(null);
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    getMonth: (data, callBack) => {
        try {
            pool.query(
                `SELECT * FROM house_month WHERE idt = ? AND idh = ?`,
                [data.idt, data.idh],
                (error, results) => {
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
    getLastMonth: (data, callBack) => {
        try {
            pool.query(
                `SELECT * FROM house_month a WHERE idt = ? AND idh = ? ORDER BY a.monthDate DESC LIMIT 1`,
                [data.idt, data.idh],
                (error, results) => {
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
    leftHouse: (id, callBack) => {
        try {
            pool.query(
                `UPDATE house SET type = ? WHERE idh = ?`,
                [0, id],
                (error, results) => {
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
    onHouse: (id, callBack) => {
        try {
            pool.query(
                `UPDATE house SET type = ? WHERE idh = ?`,
                [1, id],
                (error, results) => {
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
    leftHouseSecond: (idt, callBack) => {
        try {
            pool.query(
                `UPDATE house_trent SET isLeft = ? WHERE idt = ?`,
                [0, idt],
                (error, results) => {
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
