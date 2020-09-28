'use strict';
require('dotenv').config();
require('ejs');
// bring in my dependencies
const express = require('express');
const app = express();
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', (err) => console.log(err));

// bring in my middleware
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
// global variables

app.use(cors());

//routs
// app.get('/', renderHomePage);
// app.post('/search', collectData);
// app.get('/searchform', renderSearchForm);
app.get('/search', collectData);

//callback function

function collectData(request, response) {
	// collect form information
	// console.log(request.body);
	// { search: [ 'Elizabeth Moon', 'artist' ] }
	// { search: [ 'The magic of thinking big', 'name' ] }
	const searchQuery = request.body.search[0];
	const searchType = request.body.search[1];
	let url = 'https://api.magicthegathering.io/v1/cards?name=tarmogoyf';
	if (searchType === 'name') {
		url += `+name:${searchQuery}`;
	}
	if (searchType === 'artist') {
		url += `+artist:${searchQuery}`;
	}

	superagent.get(url).then((data) => {
		//array of arrays
		console.log(data.body);
		const cardArray = data.body.cards;
		// console.log(bookArray);
		//a book is an object with key value pairs
		const finalCardArray = cardArray.map((value) => new Card(value));
		console.log(finalCardArray);
		// response.render('pages/searches/show', { result: finalCardArray });
	});
}
// function renderHomePage(request, response) {
// 	response.status(200).send('/');
// }
//not found
function notFoundHandler(req, res) {
	res.status(404).send('not found!');
}

//card constructor
function Card(obj) {
	this.name = obj.name;
	this.artist = obj.artist;
	this.image_url = obj.imageUrl;
	this.artist_store_url = '';
}

app.use('*', notFoundHandler);
// start server
function startServer() {
	app.listen(PORT, () => {
		console.log('Server is listening on port', PORT);
	});
}
client
	.connect()
	.then(startServer)
	.catch((e) => console.log(e));
