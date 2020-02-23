var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false}));

///////// mysql //////////
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    database: 'nurseschedule',
    user: 'root',
    password: 'bobo4001'
})

router.get('/', function(req, res, next){
    var user_id = req.body.user_id;
    var year = req.body.year;
    var month = req.body.month;

    if (!user_id) {
        res.send({ result:false, message: 'no user_id value'});
        return;
    } else if (!year) {
        res.send({ result:false, message: 'no year value'});
        return;
    } else if (!month) {
        res.send({ result:false, message: 'no month value'});
        return;
    }

    pool.query("SELECT * FROM Schedule_? WHERE year=? and month=?", 
    [parseInt(user_id), parseInt(year), parseInt(month)], function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            res.send(results);
        }
    });
});

router.post('/', function(req, res, next){
    var user_id = req.body.user_id;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var schedule_type_code = req.body.schedule_type_code;

    if (!user_id) {
        res.send({ result: false, message: 'no user_id value;' });
        return;
    } else if (!year) {
        res.send({ result: false, message: 'no year value;' });
        return;
    } else if (!month) {
        res.send({ result: false, message: 'no month value;' });
        return;
    } else if (!day) {
        res.send({ result: false, message: 'no day value;' });
        return;
    } else if (!schedule_type_code) {
        res.send({ result: false, message: 'no schedule_type_code value' });
        return;
    }
    pool.query("SELECT * FROM Schedule_Type_? WHERE schedule_type_code=?",
    [ parseInt(user_id), parseInt(schedule_type_code) ], function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            if (results.length > 0) { // if schedule_type_code exist
                pool.query("INSERT INTO Schedule_? (year, month, day, schedule_type_code, created_at) \
                            VALUES (?, ?, ?, ?, NOW())", 
                [ parseInt(user_id), parseInt(year), parseInt(month), parseInt(day), parseInt(schedule_type_code) ],
                function(error2, results2, fields2){
                    if (error2) {
                        res.send({ result: false, message: error2 });
                    } else {
                        res.send(results2);
                    }
                });
            } else {
                res.send({ result:false, message: 'schedule_type_code not exist' });
            }
        }
    });    
});

router.put('/', function(req, res, next){
    var user_id = req.body.user_id;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;
    var schedule_type_code = req.body.schedule_type_code;

    if (!user_id) {
        res.send({ result: false, message: 'no user_id value' });
        return;
    } else if (!year) {
        res.send({ result: false, message: 'no year value' });
        return;
    } else if (!month) {
        res.send({ result: false, message: 'no month value' });
        return;
    } else if (!day) {
        res.send({ result: false, message: 'no day value' });
        return;
    } else if (!schedule_type_code) {
        res.send({ result: false, message: 'no schedule_type_code' });
        return;
    }

    pool.query("SELECT * FROM Schedule_type_? WHERE schedule_type_code=?", 
    [ parseInt(user_id), parseInt(schedule_type_code) ], function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            if (error) {
                res.send({ result: false, message: error });
            } else {
                if (results.length > 0) {
                    pool.query('UPDATE Schedule_? SET schedule_type_code=?, updated_at=NOW() WHERE year=? and month=? and day=?', 
                    [ parseInt(user_id), parseInt(schedule_type_code), parseInt(year), parseInt(month), parseInt(day) ], function(error2, results2, fields2){
                        if (error2) {
                            res.send({ result: false, message: error2 });
                        } else {
                            res.send(results2);
                        }
                    });
                } else {
                    res.send({ result: false, message: 'schedule_type_code does not exist' })
                }
                
            }
        }
    });
});

router.delete('/', function(req, res, next){
    var user_id = req.body.user_id;
    var year = req.body.year;
    var month = req.body.month;
    var day = req.body.day;

    if (!user_id) {
        res.send( { result: false, message: 'no user_id value' });
        return;
    } else if (!year) {
        res.send( { result: false, message: 'no year value' });
        return;
    } else if (!month) {
        res.send( { result: false, message: 'no month value' });
        return;
    }else if (!day) {
        res.send( { result: false, message: 'no day value' });
        return;
    }

    pool.query('DELETE FROM Schedule_? WHERE year=? and month=? and day=?', 
    [ parseInt(user_id), parseInt(year), parseInt(month), parseInt(day) ], function(error, results, fileds){
        if (error) {
            send.res({ result:false, message: error });
        } else {
            res.send(results);
        }
    });
})

module.exports = router;