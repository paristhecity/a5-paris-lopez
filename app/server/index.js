//express imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

//passport imports
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//lowdb imports
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

const dir = "public/";
app.use(express.static(dir));
app.use(bodyParser.json());

//Teacher Users
db.defaults({ users: [] }).write();
var users;
const occupyUsers = function() {
    users = [];
    let i = 0;
    while (true) {
        let user = db.get(`users[${i}]`).value();
        if (user) users.push(user);
        else break;
        i++;
    }
};
occupyUsers();

//Password Authentication
const strategy = function(username, password, done) {
    const user = users.find(usr => usr.username === username);
    if (user === undefined)
        return done(null, false, { message: 'User Not Found' });
    else if (user.password === password)
        return done(null, { username, password });
    else
        return done(null, false, { message: 'Password Incorrect' });
};

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(strategy));

passport.serializeUser((user, done) => done(null, user.username))
passport.deserializeUser((username, done) => {
    let user = users.find(usr => usr.username === username)
    if (user !== undefined) {
        done(null, user)
    } else {
        done(null, false, { message: 'User Not Found' })
    }
});


//POST REQUESTS
app.post( '/login', //Login
    passport.authenticate('local'),
    function( request, response ) {
        var user = 0;
        while (user < users.length) { //Sets the active user
            var dbUsername = String(db.get('users[' + user + '].username'));
            if( dbUsername === request.user.username) {
                db.get('users[' + user + ']').assign({ active: 1 }).write();
            }
            else {
                db.get('users[' + user + ']').assign({ active: 0 }).write();
            }
            user++
        }
        occupyUsers();
        //const currentUser = users.find(usr => usr.username === request.user.username)
        response.json({ status: true });
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end();
    });

app.post( '/activateStudent', function( request, response ) { //Sets selected student to active
    let user = findActiveUser();
    let i = 0;

    while (i < users[user].students.length) { //Sets the active student
        var dbUsername = String(db.get('users[' + user + '].students[' + i + '].first'));
        if( dbUsername === request.first) {
            db.get('users[' + user + '].students[' + i + ']').push({ active: 1 }).write();
        }
        else {
            db.get('users[' + user + '].students[' + i + ']').push({ active: 0 }).write();
        }
        i++;
    }
    occupyUsers();
    //var temp = db.get('users[' + user + '].students[' + i + '].active');
    //const currentUser = users.find(usr => usr.username === request.user.username)
    response.json({ status: true });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end();

});

app.post( '/addStudent', function( request, response ) {
    let i = findActiveUser();
    db.get('users['+i+'].students').push(request.body).write();
    occupyUsers();
    response.json({ status: true });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
});

app.post( '/deleteStudent', function( request, response ) {
    let i = findActiveUser();
    db.get('users['+i+'].students').remove({ first: request.body.first, last: request.body.last }).write();
    occupyUsers();
    response.json({ status: true });
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
});

app.post( '/addAssignment', function( request, response ) {
    let i = findActiveUser();
    db.get('users['+i+'].students[0].assignments').push(request.body).write();
    occupyUsers();
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
});

app.post( '/delAssignment', function( request, response ) {
    let i = findActiveUser();
    db.get('users['+i+'].students[0].assignments').remove({ assignment: request.body.assignment, grade: request.body.grade }).write();
    occupyUsers();
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end();
});

//GET REQUESTS
app.get( '/occupyStudents', function( request, response ) {
    var studentList;
    let i = findActiveUser();
    studentList = users[i].students;
    response.send(studentList)
});

app.get( '/student', function( request, response ) {
    let i = findActiveUser();
    let j = findActiveStudent( i );
    let list = [i, j];
    response.send(list)
});

app.get( '/occupyAssignments', function( request, response ) {
    var assignmentList;
    let usr = findActiveUser();
    let student = findActiveStudent( usr );
    assignmentList = users[usr].students[student].assignments;
    response.send(assignmentList)
});

//OTHER INFORMATION
const findActiveUser = function( ) {
    let i; //user index
    for(i = 0; i < users.length; i++){
        if(users[i].active === 1){
            return i;
        }
    }
};

const findActiveStudent = function( usr ) {
    let j = 0; //student index
    for(j = 0; j < users[usr].students.length; j++){
        if(users[usr].students[j].active === 1){
            return j;
        }
    }
    return -1; //if no active user is found
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));





