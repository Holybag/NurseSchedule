var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false}));

//////// mysql ////////
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  database: 'nurseschedule',
  user: 'root',
  password: 'bobo4001'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.query("SELECT * FROM Users", function(err, results, fields){
    if (err){
      res.send( { result: 'fail', message: err} );
    } else {
      res.send( results );
    }
  })
});

router.post('/', function(req, res, next){
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;

  if (!email) {
    res.send({ result: false, message: 'no email value'});
    return;
  } else if (!name) {
    res.send({ result: false, message: 'no name value'});
    return;
  } else if (!password) {
    res.send({ result: false, message: 'no password value'});
    return;
  }

  pool.query("INSERT INTO Users (email, name, password, created_at) \
              VALUES ( ?, ?, ?, now() )", 
              [ email, name, password], function(error, results, fields){
                if (error) {
                  res.send({ result: false, message: error });
                } else {
                  pool.query("CREATE TABLE Schedule_? ( \
                    year INT(11) NOT NULL,\
                    month INT(11) NOT NULL,\
                    day INT(11) NOT NULL,\
                    schedule_type_code INT(11) NOT NULL,\
                    created_at DATETIME NOT NULL,\
                    updated_at DATETIME,\
                    PRIMARY KEY(year, month, day))", 
                  [ results.insertId ], function(error2, results2, fields2){
                    if (error2) {
                      res.send({ result: false, message: error2 });
                    } else {
                      pool.query("CREATE TABLE Schedule_Type_? (\
                        schedule_type_code INT(11) NOT NULL AUTO_INCREMENT,\
                        schedule_type_name VARCHAR(50) NOT NULL,\
                        schedule_type_color INT(11) NOT NULL,\
                        schedule_type_from VARCHAR(10) NOT NULL,\
                        schedule_type_to VARCHAR(10) NOT NULL,\
                        PRIMARY KEY(schedule_type_code))", 
                      [ results.insertId ], function(error3, results3, field3){
                        if (error3) {
                          res.send({ result: false, message: error3 });
                        } else {
                          res.send({ results });
                        }
                      })
                    }
                  });
                }
              });
})

module.exports = router;
