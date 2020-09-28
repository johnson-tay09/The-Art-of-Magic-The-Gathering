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
app.post('/search', collectData);
// app.get('/searchform', renderSearchForm);
app.get('/search', collectData);

//callback function

function collectData(request, response) {
	const searchQuery = request.body.search[0];
	const searchType = request.body.search[1];
	let url = 'https://api.magicthegathering.io/v1/cards?';
	if (searchType === 'name') {
		url += `+name:${searchQuery}`;
	}
	if (searchType === 'artist') {
		url += `+artist:${searchQuery}`;
	}
	superagent.get(url).then((data) => {
		const cardArray = data.body.cards;
		console.log(cardArray);
		const finalCardArray = cardArray.map((value) => new Card(value));
		console.log(finalCardArray);
		response.render('../views/pages/searches/show.ejs', {finalCardArray: finalCardArray });
	});
}

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

function renderHomePage(req, res){
	res.status(200).render('../views/index.ejs')
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
