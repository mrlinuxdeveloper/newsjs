const express = require('express');
// const DB = require('./DB');
const Home = require('./controllers/HomeController');
const About = require('./controllers/AboutController');
const BlogRouter = require('./router/blog/router');

// app
const app = express();

// middleware and database
app.set('view engine', 'ejs' );
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// route

app.get('/', Home);
app.get('/about', About);
app.use('/blog',BlogRouter);

app.use(( req, res) => {
    res.status(404).render('404');
});

app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
