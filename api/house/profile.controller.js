const moment = require('moment');
const {
    getAll,
    createHouse,
    deleteHouse,
    editHouse,
    getTrent,
    createTrent,
    createMonthPayment,
    uploadImage,
    deleteTrent,
    editTrent,
    deleteMonth,
    editMonth,
    getByIdTrent,
    getMonth,
    getLastMonth,
    getDetialData,
    deleteUpdateMonth,
    createMonthNoUpdatePayment,
    leftHouse,
    leftHouseSecond,
    onHouse
} = require("./profile.service");

module.exports = {
    getAll: (req, res) => {
        try {
            getAll((err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                getDetialData((err, result) => {
                    if (err) {
                        return res.json({
                            status: 0,
                            message: "Өгөгдлийн сангийн алдаа!"
                        })
                    }
                    return res.status(200).json({
                        status: 1,
                        message: "Амжилттай",
                        data: results,
                        detial: result
                    })
                })

            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    createHouse: (req, res) => {
        try {
            var data = req.body;
            createHouse(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай хадгалагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    deleteHouse: (req, res) => {
        const id = req.params.id;
        try {
            deleteHouse(id, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай устгагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    editHouse: (req, res) => {
        try {
            var data = req.body;
            editHouse(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай засагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    getTrent: (req, res) => {
        try {
            const id = req.params.idh;
            getTrent(id, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай",
                    data: results
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    createTrent: (req, res) => {
        try {
            var imageNames = req.files.map(file => file.filename);
            var data = req.body;
            createTrent(data, (err, resultIdt) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                onHouse(data.idh, (err) => {
                    if (err) {
                        return res.json({
                            status: 0,
                            message: "Өгөгдлийн сангийн алдаа!"
                        })
                    }
                    if (req.file && req.files.length < 2) {
                        data["imageName"] = req.file.filename;
                        var imageData = { imageName: data.imageName, idt: resultIdt, idh: data.idh };
                        uploadImage(imageData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                    } else {
                        for (let i = 0; i < req.files.length; i++) {
                            var imageData = { imageName: imageNames[i], idt: resultIdt, idh: data.idh };
                            uploadImage(imageData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        }
                    }
                    var countMonth;
                    var remainder;
                    const now = new Date();
                    if (data.paymentPrice < data.price) {
                        countMonth = 0;
                        remainder = data.paymentPrice - data.price;
                        var sendData = { monthDate: data.trentDate, price: data.paymentPrice, underpayment: remainder, type: 1, paymentDate: now, idh: data.idh, idt: resultIdt };
                        createMonthPayment(sendData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        countMonth = Math.floor(data.paymentPrice / data.price);
                        remainder = data.paymentPrice % data.price;
                        if (remainder !== 0) {
                            countMonth = countMonth + 1;
                            for (let i = 0; i < countMonth - 1; i++) {
                                const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                                var sendData = {
                                    monthDate: nextMonthDate,
                                    price: data.price,
                                    underpayment: 0,
                                    type: 0,
                                    paymentDate: now,
                                    idh: data.idh,
                                    idt: resultIdt
                                };
                                createMonthPayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                            const lastMonthDate = moment(data.trentDate).add(countMonth - 1, 'months').toDate();
                            var underpaymentPrice = remainder - data.price;
                            var remainderData = {
                                monthDate: lastMonthDate,
                                price: remainder,
                                underpayment: underpaymentPrice,
                                type: 1,
                                paymentDate: now,
                                idh: data.idh,
                                idt: resultIdt
                            };
                            createMonthPayment(remainderData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            if (countMonth === 1) {
                                var sendData = { monthDate: data.trentDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: resultIdt };
                                createMonthPayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            } else {
                                for (let i = 0; i < countMonth; i++) {
                                    const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                                    var sendData = { monthDate: nextMonthDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: resultIdt };
                                    createMonthPayment(sendData, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                }
                            }
                        }
                    }
                    return res.status(200).json({
                        status: 1,
                        message: "Амжилттай хадгалагдлаа"
                    })
                })
            })
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 0,
                message: "Кодны алдаа!"
            });
        }
    },
    createNoImageTrent: (req, res) => {
        try {
            var data = req.body;
            createTrent(data, (err, resultIdt) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                onHouse(data.idh, (err) => {
                    if (err) {
                        return res.json({
                            status: 0,
                            message: "Өгөгдлийн сангийн алдаа!"
                        })
                    }
                    var countMonth;
                    var remainder;
                    const now = new Date();
                    if (data.paymentPrice < data.price) {
                        countMonth = 0;
                        remainder = data.paymentPrice - data.price;
                        var sendData = { monthDate: data.trentDate, price: data.paymentPrice, underpayment: remainder, type: 1, paymentDate: now, idh: data.idh, idt: resultIdt };
                        createMonthPayment(sendData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        countMonth = Math.floor(data.paymentPrice / data.price);
                        remainder = data.paymentPrice % data.price;
                        if (remainder !== 0) {
                            countMonth = countMonth + 1;
                            for (let i = 0; i < countMonth - 1; i++) {
                                const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                                var sendData = {
                                    monthDate: nextMonthDate,
                                    price: data.price,
                                    underpayment: 0,
                                    type: 0,
                                    paymentDate: now,
                                    idh: data.idh,
                                    idt: resultIdt
                                };
                                createMonthPayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                            const lastMonthDate = moment(data.trentDate).add(countMonth - 1, 'months').toDate();
                            var underpaymentPrice = remainder - data.price;
                            var remainderData = {
                                monthDate: lastMonthDate,
                                price: remainder,
                                underpayment: underpaymentPrice,
                                type: 1,
                                paymentDate: now,
                                idh: data.idh,
                                idt: resultIdt
                            };
                            createMonthPayment(remainderData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            if (countMonth === 1) {
                                var sendData = { monthDate: data.trentDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: resultIdt };
                                createMonthPayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            } else {
                                for (let i = 0; i < countMonth; i++) {
                                    const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                                    var sendData = { monthDate: nextMonthDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: resultIdt };
                                    createMonthPayment(sendData, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                }
                            }
                        }
                    }
                    return res.status(200).json({
                        status: 1,
                        message: "Амжилттай хадгалагдлаа"
                    })
                })
            })
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: 0,
                message: "Кодны алдаа!"
            });
        }
    },
    deleteTrent: (req, res) => {
        const id = req.params.id;
        try {
            deleteTrent(id, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай устгагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    editTrent: (req, res) => {
        try {
            var data = req.body;
            editTrent(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                var idData = { idt: data.idt, idh: data.idh };
                deleteUpdateMonth(idData, (err) => {
                    if (err) {
                        console.log("Сарын төлбөр устгах алдаа: " + err)
                    }
                });
                var countMonth;
                var remainder;
                const now = new Date();
                if (data.paymentPrice < data.price) {
                    countMonth = 0;
                    remainder = data.paymentPrice - data.price;
                    var sendData = { monthDate: data.trentDate, price: data.paymentPrice, underpayment: remainder, type: 1, paymentDate: now, idh: data.idh, idt: data.idt };
                    createMonthPayment(sendData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else {
                    countMonth = Math.floor(data.paymentPrice / data.price);
                    remainder = data.paymentPrice % data.price;
                    if (remainder !== 0) {
                        countMonth = countMonth + 1;
                        for (let i = 0; i < countMonth - 1; i++) {
                            const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                            var sendData = {
                                monthDate: nextMonthDate,
                                price: data.price,
                                underpayment: 0,
                                type: 0,
                                paymentDate: now,
                                idh: data.idh,
                                idt: data.idt
                            };
                            createMonthPayment(sendData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                        const lastMonthDate = moment(data.trentDate).add(countMonth - 1, 'months').toDate();
                        var underpaymentPrice = remainder - data.price;
                        var remainderData = {
                            monthDate: lastMonthDate,
                            price: remainder,
                            underpayment: underpaymentPrice,
                            type: 1,
                            paymentDate: now,
                            idh: data.idh,
                            idt: data.idt
                        };
                        createMonthPayment(remainderData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        if (countMonth === 1) {
                            var sendData = { monthDate: data.trentDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: data.idt };
                            createMonthPayment(sendData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            })
                        } else {
                            for (let i = 0; i < countMonth; i++) {
                                const nextMonthDate = moment(data.trentDate).add(i, 'months').toDate();
                                var sendData = { monthDate: nextMonthDate, price: data.price, underpayment: 0, type: 0, paymentDate: now, idh: data.idh, idt: data.idt };
                                createMonthPayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            }
                        }
                    }
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай засагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    deleteMonth: (req, res) => {
        const idt = req.params.idt;
        const idh = req.params.idh;
        var data = { idt: idt, idh: idh }
        try {
            deleteMonth(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай устгагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    createMonth: (req, res) => {
        try {
            var data = req.body;
            getLastMonth(data, (err, result) => {
                if (err) {
                    console.log(err);
                }
                const lastMonthData = result[0];
                const monthPrice = data.paymentPrice + lastMonthData.underpayment;
                if (monthPrice < 0) {
                    var sendMonthData = { monthDate: lastMonthData.monthDate, underpayment: monthPrice, paymentDate: data.paymentDate, price: data.price, type: 1, houseMonthId: lastMonthData.houseMonthId };
                    editMonth(sendMonthData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else if (monthPrice === 0) {
                    var sendMonthData = { monthDate: lastMonthData.monthDate, underpayment: monthPrice, paymentDate: data.paymentDate, price: data.price, type: 0, houseMonthId: lastMonthData.houseMonthId };
                    editMonth(sendMonthData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                } else {
                    var sendMonthData = { monthDate: lastMonthData.monthDate, underpayment: 0, paymentDate: data.paymentDate, price: data.price, type: 0, houseMonthId: lastMonthData.houseMonthId };
                    editMonth(sendMonthData, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    var countMonth;
                    var remainder;
                    if (monthPrice < data.price) {
                        const nextMonthDate = moment(lastMonthData.monthDate).add(1, 'months').toDate();
                        countMonth = 0;
                        remainder = monthPrice - data.price;
                        var sendData = { monthDate: nextMonthDate, price: monthPrice, underpayment: remainder, type: 1, paymentDate: data.paymentDate, idh: data.idh, idt: data.idt };
                        createMonthNoUpdatePayment(sendData, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        countMonth = Math.floor(monthPrice / data.price);
                        remainder = monthPrice % data.price;
                        if (remainder !== 0) {
                            countMonth = countMonth + 1;
                            for (let i = 0; i < countMonth - 1; i++) {
                                const nextMonthDate = moment(lastMonthData.monthDate).add(i + 1, 'months').toDate();
                                var sendData = {
                                    monthDate: nextMonthDate,
                                    price: data.price,
                                    underpayment: 0,
                                    type: 0,
                                    paymentDate: data.paymentDate,
                                    idh: data.idh,
                                    idt: data.idt
                                };
                                createMonthNoUpdatePayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                            const lastMonthDate = moment(lastMonthData.monthDate).add(countMonth, 'months').toDate();
                            var underpaymentPrice = remainder - data.price;
                            var remainderData = {
                                monthDate: lastMonthDate,
                                price: remainder,
                                underpayment: underpaymentPrice,
                                type: 1,
                                paymentDate: data.paymentDate,
                                idh: data.idh,
                                idt: data.idt
                            };
                            createMonthNoUpdatePayment(remainderData, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            if (countMonth === 1) {
                                var sendData = { monthDate: lastMonthData.monthDate, price: data.price, underpayment: 0, type: 0, paymentDate: data.paymentDate, idh: data.idh, idt: data.idt };
                                createMonthNoUpdatePayment(sendData, (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                })
                            } else {
                                for (let i = 0; i < countMonth; i++) {
                                    const nextMonthDate = moment(lastMonthData.monthDate).add(i + 1, 'months').toDate();
                                    var sendData = { monthDate: nextMonthDate, price: data.price, underpayment: 0, type: 0, paymentDate: data.paymentDate, idh: data.idh, idt: data.idt };
                                    createMonthNoUpdatePayment(sendData, (err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            });
            return res.status(200).json({
                status: 1,
                message: "Амжилттай хадгалагдлаа"
            });
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Код алдаа!"
            });
        }
    },
    editMonth: (req, res) => {
        try {
            var data = req.body;
            console.log(data);
            editMonth(data, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай засагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    getMonth: (req, res) => {
        try {
            var data = req.body;
            getMonth(data, (err, results) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай",
                    data: results
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
    leftHouse: (req, res) => {
        try {
            const id = req.params.idh;
            const idt = req.params.idt;
            leftHouse(id, (err) => {
                if (err) {
                    return res.json({
                        status: 0,
                        message: "Өгөгдлийн сангийн алдаа!"
                    })
                }
                leftHouseSecond(idt, (err) => {
                    if (err) {
                        return res.json({
                            status: 0,
                            message: "Өгөгдлийн сангийн алдаа!"
                        })
                    }
                });
                return res.status(200).json({
                    status: 1,
                    message: "Амжилттай хадгалагдлаа"
                })
            })
        } catch (e) {
            return res.status(500).json({
                status: 0,
                message: "Сервер ӨС алдаа!"
            });
        }
    },
};