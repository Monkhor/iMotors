const pool = require("../../config/database");

module.exports = {
  getUsers: callBack => {
    pool.query(
      `SELECT * FROM user`,
      [],
      (error, results) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserName: (name, callBack) => {
    pool.query(
      `SELECT * FROM User WHERE name = ?`,
      [name],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  create: (data, callBack) => {
    pool.query(
      `insert into User(name, role, phone, password) 
                values(?,?,?,?)`,
      [
        data.name,
        data.role,
        data.phone,
        data.password
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select * from User where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },

  updateUser: (data, callBack) => {
    pool.query(
      `update User set name=?, email=?, phone=?, deviceId=?, password=? where id = ?`,
      [
        data.name,
        data.email,
        data.phone,
        data.deviceId,
        data.password,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      `delete from User where id = ?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  }
};
