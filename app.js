// 1. Node Modules and dependencies

const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const {Client} = require('pg')
// ---------
// const dotenv = require('dotenv')

// dotenv.load();
// const postgres.user = process.env.DB_USER
// const postgres.user = process.env.DB_PASS

// --------------
const connectionString = 'postgresql://postgres:giants@localhost:5433/bulletinboard'
// postgres - username - password - port - databasename

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static('public'))
// tells it that HTML files are in the public folder

app.set('view engine', 'ejs')





// 2. Next, I need pull/get from the 'messagestable' table
// from the 'bulletinboard' database, while display the messageBoard 
// EJS file 
app.get('/',(req,res)=>{
const client = new Client({
        connectionString: connectionString,
    })
    client.connect()
    // think of client.connect as the method letting the client open the door
    .then(()=>{
        // calls the data
        return client.query(`SELECT * FROM messagestable`)
    })
    .then((result)=>{
        console.log(result);
        return res.render('messageBoard', {result})
    })
})



// 3. Be able to ADD new messages to the Bulletin Board
    app.post('/add',(req,res)=>{
        const client = new Client({
                connectionString: connectionString,
            })
            client.connect()
            .then(()=>{
                return client.query(`INSERT INTO messagestable (title, body) values ($1, $2)`, [req.body.title, req.body.body])
            })
            .then((result)=>{
                return res.redirect('/')
                // finally, redirect to the home page!!!
            })
        })

    // 4. DELETE functionality
    app.post('/delete/message/:id',(req,res)=>{
        const client = new Client({
            connectionString: connectionString,
        })
        client.connect()
        .then(()=>{
            return client.query(`DELETE FROM messagestable WHERE id=$1`,[req.params.id])
        })
        .then((result)=>{
            return res.redirect('/')
        })
    })
    // 4a.  I also want users to be able to EDIT their posts
    // 4b.  First I want to render another ejs form...which we will edit
    // first read and get its ID so we get the exact record
    app.get('/edit/message/:id',(req,res)=>{
        // setting client is necessary to be defined 
        // in order to give them a key ith user/pass
        const client = new Client({
                connectionString: connectionString,
            })
            // method to make connection
            client.connect()                
            .then(()=>{
                // make actual call to DB
                return client.query(`SELECT * FROM messagestable WHERE id=$1`,[req.params.id])
            })
            .then((result)=>{
                // get result, then ultimately send 
                // the results to the EJS file
                return res.render('edit-message', {result})
            })
        })
    
        // 4c. Update the record that was rendered full of old data!
    app.post('/update',(req,res)=>{
        const client = new Client({
                connectionString: connectionString,
            })
            client.connect()
            .then(()=>{
                return client.query(`UPDATE messagestable SET title=$1, body=$2 WHERE id=$3`, [req.body.title, req.body.body, req.body.id])
            })
            .then((result)=>{
                return res.redirect('/')
            })
        })   

app.listen(3000, ()=>{
    console.log("server running on port 3000")
})
