'use strict';
require('dotenv').config();
require('ejs');
// bring in my dependencies
const express = require('express');
const app = express();
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3000;
const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', (err) => console.log(err));

// bring in my middleware
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// global variables

app.use(cors());

//routs
app.get('/', renderHomePage);
app.post('/search', collectData);
app.get('/favorites', renderFavePage);
app.post('/add', addCard);
app.post('/searchArtist', seeMoreArtists);
app.delete('/delete/:card_id', deleteOneCard);

//callback functions
function deleteOneCard(request, response) {
	const id = request.params.card_id;
	let sql = 'DELETE FROM magic_table WHERE id=$1;';
	let safeValues = [id];
	client.query(sql, safeValues);
	response.status(200).redirect('../favorites');
}

function addCard(request, response) {
	const { name, artist, image_url, artist_store_url } = request.body;
	// put it in the database
	const sql =
		'INSERT INTO magic_table (name, artist, image_url, artist_store_url) VALUES ($1, $2, $3, $4);';
	const safeValues = [name, artist, image_url, artist_store_url];
	// console.log(safeValues);
	client.query(sql, safeValues).then((results) => {
		const id = results.rows;
		// console.log('results from sql', id);
		// redirect to the individual task when done
		console.log(results.rows);
		response.status(200).redirect(`favorites`);
	});
}
function renderFavePage(request, response) {
	// go into the database
	const sql = 'SELECT * FROM magic_table;';
	client.query(sql).then((results) => {
		// get all of my cards
		const allCards = results.rows;
		// render them to the page
		response
			.status(200)
			.render('./pages/favorites', { savedCardArry: allCards });
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
	// console.log(url);
	superagent.get(url).then((data) => {
		const cardArray = data.body.cards;
		const finalCardArray = cardArray.map((value) => new Card(value));

		response.render('../views/pages/searches/show.ejs', {
			finalCardArray: finalCardArray,
		});
	});
}

function renderHomePage(request, response) {
	response.status(200).render('/views/index.ejs');
}

// starting seeMoreArtists function
function seeMoreArtists(req, res) {
	const cardByArtist = req.body.artist;
	let url = `https://api.magicthegathering.io/v1/cards?artist=${cardByArtist}`;
	console.log(cardByArtist);

	superagent.get(url).then((data) => {
		let cardArray = data.body.cards;
		cardArray = cardArray.filter((card) => card.artist === cardByArtist);
		const finalCardArray = cardArray.map((value) => new Card(value));

		res.render('../views/pages/searches/artist.ejs', {
			finalCardArray: finalCardArray,
		});
	});
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
