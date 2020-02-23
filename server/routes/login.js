var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

var tokenKey = "NurseSchedule001";

///////mysql///////
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'nurseschedule',
    user: 'root',
    password: 'bobo4001'
});

router.get('/', function(req, res, next){
    pool.query("SELECT * FROM Login", function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            res.send({ results });
        }
    });
});

router.post('/', function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;

    if (!email) {
        res.send({ result: false, message: 'no email'});
        return;
    } else if(!password) {
        res.send({ result: false, message: 'no password'});
        return;
    }

    pool.query("SELECT * FROM Users WHERE email=? and password=?", 
    [ email, password ], function (error, results, fields) {
        if (error) {
            res.send( { result: false, message: error } );
        } else {
            if (results.length > 0) {
                var payLoad = { 'user_id': results[0].user_id };
                var token = jwt.sign(payLoad, tokenKey, {
                    algorithm: 'HS256',
                    expiresIn: 60
                });
                //console.log("token: ", token);
                pool.query("DELETE FROM Login WHERE user_id=?", [ results[0].user_id ], function (error2, results2) {
                    if (error2) {
                        res.send( { result: false, message: error });
                    } else {
                        pool.query("INSERT INTO Login (user_id, login_time, token) values(?,now(),?)", 
                        [results[0].user_id, token], function(error3, results3){
                            if (error3) {
                                res.send( { result: false, message: error3} );
                            } else {
                                res.send( { result: true, email: email, token: token, message: results3 });
                            }
                        });
                    }
                });
            } else {
                res.send( { result: false, message: 'Do not exists or wrong password!'});
            }
        }
    })    
});

router.delete('/', function(req, res, next){
    var user_id = req.body.user_id;
    var token = req.body.token;

    if (!user_id) {
        res.send({ result: false, message: 'no user_id value'});
        return;
    } else if (!token) {
        res.send({ result: false, message: 'no token value'});
        return;
    }

    pool.query("DELETE FROM Login WHERE user_id=? and token=?", 
    [user_id, token], function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            if (results.affectedRows > 0) {
                res.send({ result: true, message: results });
            } else {
                res.send({ result: false, message: 'no exist user_id or token' });
            }
        }
    });
});

module.exports = router;