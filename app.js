const express = require('express');
const path = require('path')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//Load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//passport config
require('./config/passport')(passport)
//DB config
const db = require('./config/database')

// Get rid of the warning
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
	useMongoClient: true
	})
	.then(() => console.log('mongoDb Connected'))
	.catch((err) => console.log(err))



app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}))
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

//static Folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'));

// Express Session middleware
app.use(session({
	secret: 'secret' ,
	resave: true,
	saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Glabal Variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
})

app.get('/', (req, res) => {
	const title = 'Welcome!';
	res.render('index', {
		title: title
	});
})

app.get('/about', (req, res) => {
	res.render('about');
})

const port = process.env.PORT || 3000

app.use('/ideas', ideas)
app.use('/users', users)

app.listen(port, () => console.log('Port '+port+' Running!'))










