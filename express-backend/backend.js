import express from "express";
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
    users_list :
        [
            {
                id : 'xyz789',
                name : 'Charlie',
                job: 'Janitor',
            },
            {
                id : 'abc123',
                name: 'Mac',
                job: 'Bouncer',
            },
            {
                id : 'ppp222',
                name: 'Mac',
                job: 'Professor',
            },
            {
                id: 'yat999',
                name: 'Dee',
                job: 'Aspring actress',
            },
            {
                id: 'zap555',
                name: 'Dennis',
                job: 'Bartender',
            }
        ]
}
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    let result = findUserByNameJob(name, job);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});


app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    if (userToAdd['name'] == undefined || userToAdd['job'] == undefined) {
        res.status(400).send('Make sure to include "name" and "job" fields in POST request.');
        return;
    }
    userToAdd['id'] = generateId();
    addUser(userToAdd);
    let result = {
        id: userToAdd['id'],
        name: userToAdd['name'],
        job: userToAdd['job']
    };
    res.status(201).send(result);
});

function addUser(user){
    users['users_list'].push(user);
}

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

const findUserByNameJob = (name, job) => {
    let result =  users['users_list'];
    if(name != undefined) {
        result = result.filter((user) => user['name'] === name);
    }
    if(job != undefined) {
        result = result.filter((user) => user['job'] === job);
    }
    return result;
}
app.delete('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        deleteUserById(id);
        res.status(204).end();
    }
});

function deleteUserById(id) {
    for(let i= 0; i < users['users_list'].length; i++) {
        if(users['users_list'][i]['id'] == id) {
            users['users_list'].splice(i, 1);
        }
    }
}

function generateId() {
    let result = "";
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    result += Math.floor(Math.random() * 10).toString();
    return result;
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});