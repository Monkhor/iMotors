const pool = require("../../config/database");

module.exports = {
    find: (callBack) => {
        try {
            pool.query(
                `SELECT idt,price,address,time,allPrice,baritsaa,date,imageName,userPhone,userName,id,
                CASE WHEN imageName != '' THEN CONCAT('http://128.199.78.191:3000/upload/',imageName) ELSE '' END AS imageName
                FROM trent_house`,
                (error, results, fields) => {
                    if (error) {
                      return  callBack(error);
                    }
                    callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    },
    editTurees: (data, callBack) => {
        try {
            pool.query(
                `UPDATE trent_house SET price= ?,address= ?,time = ?,allPrice = ?,baritsaa=?,date=?,userPhone=?,userName=?,id=?
                WHERE idt = ?`,
                [data.price, data.address, data.time, data.allPrice, data.baritsaa, data.dateTime, data.userPhone, data.userName, data.id, data.idt]
                ,
                (error, results, fields) => {
                    if (error) {
                        callBack(error);
                    }
                    console.log(results);
                    return callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error);
        }
    },
    create: (data, callBack) => {
        try {
            console.log(data)
            pool.query(
                `INSERT INTO trent_house
                (price,address,time,allPrice,baritsaa,date,imageName ,userPhone ,userName,id)
                VALUES(?,?,?,?,?,?,?,?,?,?)`, [
                data.price,
                data.address,
                data.time,
                data.allPrice,
                data.baritsaa,
                data.dateTime,
                data.imageName,
                data.userPhone,
                data.userName,
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
    deleteTurees: (id, callBack) => {
        try {
            console.log(id)
            pool.query(
                `DELETE FROM trent_house
                 WHERE idt = ?;`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        callBack(error);
                    }
                    return callBack(null, results);
                }
            );
        } catch (error) {
            return callBack(error)
        }
    }
};
