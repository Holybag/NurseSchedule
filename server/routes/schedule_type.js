var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));

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
    if (!user_id) {
        res.send({ result: false, message: 'no user_id value' });
        return;
    }
    pool.query("SELECT * FROM Schedule_type_?", 
    [ parseInt(user_id) ], function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            res.send(results);
        }
    })
});

router.post('/', function(req, res, next){
    var user_id = req.body.user_id;
    var schedule_type_name = req.body.schedule_type_name;
    var schedule_type_color = req.body.schedule_type_color;
    var schedule_type_from = req.body.schedule_type_from;
    var schedule_type_to = req.body.schedule_type_to;

    if (!user_id) {
        res.send({ result: false, message: 'no user_id value' });
        return;
    } else if (!schedule_type_name) {
        res.send({ result: false, message: 'no schedule_type_name value' });
        return;
    } else if (!schedule_type_color) {
        res.send({ result: false, message: 'no no schedule_type_color value' });
        return;
    } else if (!schedule_type_from) {
        res.send({ result: false, message: 'no no schedule_type_from value' });
        return;
    } else if (!schedule_type_to) {
        res.send({ result: false, message: 'no no schedule_type_to value' });
        return;
    }

    pool.query("INSERT INTO Schedule_Type_? \
    (schedule_type_name, schedule_type_color, schedule_type_from, schedule_type_to) \
    VALUES (?, ?, ?, ?)", 
    [ parseInt(user_id), schedule_type_name, parseInt(schedule_type_color), schedule_type_from, schedule_type_to ], 
    function(error, results, fields){
        if (error) {
            res.send({ result:false, message: error });
        } else {
            res.send(results);
        }
    });
});

// not yet completed sql where condition job left
router.put('/', function(req, res, next){
    // var user_id = req.body.user_id;
    // var schedule_type_code = req.body.schedule_type_code;
    // var schedule_type_name = req.body.schedule_type_name;
    // var schedule_type_color = req.body.schedule_type_color;
    // var schedule_type_from = req.body.schedule_type_from;
    // var schedule_type_to = req.body.schedule_type_to;
    // var condition = "";

    // if (schedule_type_name) {
    //     condition += "schedule_type_name=?";
    // } else if (schedule_type_color) {
    //     condition += ""
    // } else if (schedule_type_from) {
        
    // } else if (schedule_type_to) {
        
    // }

    // if (!user_id) {
    //     res.send({ result: false, message: 'no user_id value' });
    //     return;
    // } else if (!schedule_type_code) {
    //     res.send({ result: false, message: 'no schedule_type_code value' });
    //     return;
    // }



    // pool.query("UPDATE Schedule_type_? SET ")
});

router.delete('/', function(req, res, next){
    var user_id = req.body.user_id;
    var schedule_type_code = req.body.schedule_type_code;

    if (!user_id) {
        res.send({ result: false, message: 'no user_id value' });
        return;
    } else if (!schedule_type_code) {
        res.send({ result: false, message: 'no schedule_type_code value' });
        return;
    }

    pool.query("DELETE FROM Schedule_type_?", 
    [ user_id, parseInt(schedule_type_code) ]),
    function(error, results, fields){
        if (error) {
            res.send({ result: false, message: error });
        } else {
            res.send(results);
        }
    }
});

module.exports = router;