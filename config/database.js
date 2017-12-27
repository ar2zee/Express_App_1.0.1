if(process.env.NODE_ENV === 'production') {
	module.exports = {mongoURI: 'mongodb://test:test@ds163656.mlab.com:63656/expres_app'}
} else {
	module.exports = {mongoURI: 'mongodb://localhost/express-app'}
}