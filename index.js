const express = require("express");
const axios = require("axios");
const mysql = require("mysql2")
const app = express();

app.use(express.json());

const api_key = "" //freshworks api credentials go here
const domain = ""


// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: '', //mysql username and password go here
    password: '', 
    database: 'test'
});

app.get("/", (req, res) => {
    res.send("works")
})

//add a contact

app.post("/createContact", async (req, res) => {

    if (req.query.data_store == "DATABASE") {
        const { first_name, last_name, email, mobile_number } = req.query;
        const query = 'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)';
        connection.query(query, [first_name, last_name, email, mobile_number], (err, results) => {
            if (err) {
                return res.send(err);
            }
            res.send(results);
        });
    }
    else {
        const data = {
            "contact": {
                "first_name": req.query.first_name,
                "last_name": req.query.last_name,
                "email": req.query.email,
                "mobile_number": req.query.mobile_number
            }
        }

        const config = {
            method: 'post',
            url: domain,
            headers: {
                'Authorization': `Token token=${api_key}`,
                'Content-Type': 'application/json'
            },
            data
        }

        axios(config)
            .then((response) => {
                console.log(response)
                res.send(response)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
})

//look up a contact
app.get("/getContact", (req, res) => {

    if (req.query.data_store == "DATABASE") {
        const { id } = req.query;
        const query = 'SELECT * FROM contacts WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return res.send(err);
            }
            res.send(results);
        });
    }
    else {
        const id = req.query.id
        const config = {
            method: 'get',
            url: domain + `${id}`,
            headers: {
                'Authorization': `Token token=${api_key}`,
                'Content-Type': 'application/json'
            },
        }

        axios(config)
            .then((response) => {
                console.log(response.data)
                res.send(response.data)
            })
            .catch((err) => {
                res.send(err)
            })
    }
})

//updateContact
app.post("/updateContact", (req, res) => {
    if (req.query.data_store == "DATABASE") {
        const { id, email, mobile_number } = req.query;
        const query = 'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?';
        connection.query(query, [email, mobile_number, id], (err, results) => {
            if (err) {
                return res.send(err);
            }
            res.send(results);
        });
    }
    else {
        const id = req.query.id
        const data = {
            "contact": {
                "email": req.query.email,
                "mobile_number": req.query.mobile_number
            }
        }

        const config = {
            method: 'put',
            url: domain + `${id}`,
            headers: {
                'Authorization': `Token token=${api_key}`,
                'Content-Type': 'application/json'
            },
            data
        }

        axios(config)
            .then((response) => {
                console.log(response.data)
                res.send(response.data)
            })
            .catch((err) => {
                res.send(err)
            })

    }
})

//deleteContact
app.post("/deleteContact", (req, res) => {
    const id = req.query.id

    if (req.query.data_store == "DATABASE") {
        const { id } = req.query;
        const query = 'DELETE FROM contacts WHERE id = ?';
        connection.query(query, [id], (err, results) => {
            if (err) {
                return res.send(err);
            }
            res.send(results);
        });
    }

    else {
        const config = {
            method: 'delete',
            url: domain + `${id}`,
            headers: {
                'Authorization': `Token token=${api_key}`,
                'Content-Type': 'application/json'
            },
        }

        axios(config)
            .then((response) => {
                console.log(response.data)
                res.send(response.data)
            })
            .catch((err) => {
                res.send(err)
            })
    }
})

app.listen(8888, () => {
    console.log("listening on port 8888")
})