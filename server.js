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
app.get('/', renderHomePage);
// app.post('/search', collectData);
app.post('/search', collectData);
app.get('/favorites', renderFavePage);

//callback functions

function renderFavePage(request, response) {
	// go into the database
	const sql = 'SELECT * FROM magic_table;';
	client.query(sql).then((results) => {
		// get all of my tasks
		const allCards = results.rows;
		// render them to the page
		response
			.status(200)
			.render('pages/favorites.ejs', { savedCardArry: allCards });
	});
}

function collectData(request, response) {
	const searchQuery = request.body.search[0];
	const searchType = request.body.search[1];
	let url = 'https://api.magicthegathering.io/v1/cards?';
	if (searchType === 'name') {
		url += `name=${searchQuery}`;
	}
	if (searchType === 'artist') {
		url += `artist=${searchQuery}`;
	}
	console.log(url);
	superagent.get(url).then((data) => {
		const cardArray = data.body.cards;
		const finalCardArray = cardArray.map((value) => new Card(value));

		response.render('../views/pages/searches/show.ejs', {finalCardArray: finalCardArray });

	});
}

function renderHomePage(request, response) {
	response.status(200).render('/views/index.ejs');
}
//not found

function notFoundHandler(req, res) {
	res.status(404).send('not found!');
}

//card constructor
function Card(obj) {
	this.name = obj.name;
	this.artist = obj.artist;
	this.image_url = obj.imageUrl
		? obj.imageUrl
		: 'https://i.imgur.com/J5LVHEL.jpg';
	this.artist_store_url = '';
}

function renderHomePage(req, res) {
	res.status(200).render('../views/index.ejs');
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
