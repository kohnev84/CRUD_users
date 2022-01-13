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


app.post('/updateuser', (req, res, next) => {
    console.log(req.body)
    let update_content = req.body.update_content
    let select_content = req.body.select_content
    let update_name = req.body.update_name
    let update_last_name = req.body.update_last_name
    if (select_content === "age" || select_content === "height" || select_content === "weight") {
        update_content = +req.body.update_content
    }
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`UPDATE users SET ${select_content} = '${update_content}'  WHERE name = '${update_name}' AND last_name = '${update_last_name}';`, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(`пользователь обновлен`);
        })
    })
});


app.post('/delete_user', (req, res, next) => {
    console.log(req.body, "check")
    let delete_name = req.body.delete_name
    let delete_last_name = req.body.delete_last_name
    console.log({ delete_name, delete_last_name })
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query(`DELETE FROM  users  WHERE name = '${delete_name}' AND last_name = '${delete_last_name}';`, function (err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(`пользователь удален`);
        })
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Listening on " + port))
