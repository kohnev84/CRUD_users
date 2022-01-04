const express = require("express");
const app = express();
const path = require('path');
var pg = require('pg');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Подключаем статику
app.use(express.static(path.join(__dirname, 'public')));

// Подключаем views(hbs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Отображаем главную страницу с использованием шаблона "index.hbs"
app.get('/', function (req, res) {
    res.render('index', req.query);
});

app.get('/newyear', function (req, res) {
    res.render('new_year', req.query);
});


const config = {
    user: 'postgres',
    database: 'africans2',
    password: 'postgres',
    port: 5432
};

// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);


app.post('/getall', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM users', function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        })
    })
});

app.post('/addnewuser', (req, res, next) => {
    console.log(req.body, req.body.name, req.body.last_name, req.body.age, req.body.education, req.body.height, req.body.weight, req.body.gender)
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`INSERT INTO users (name, last_name, age, education, height, weight, gender) VALUES ('${req.body.name}','${req.body.last_name}','${+req.body.age}','${req.body.education}','${+req.body.height}','${+req.body.weight}','${req.body.gender}');`, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(`пользователь сохранен ${req.body.name}`);
        })
    })
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on " + port))