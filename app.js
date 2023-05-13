const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
   
    const data = {
       members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
       }] 
    }

    const jsonData = JSON.stringify(data);
    const url= 'https://us21.api.mailchimp.com/3.0/lists/2d7247c248'

    const options ={
        method: 'POST',
        auth: "navjot:6698969f33e88de71f545dc6ef167ef5-us21"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 2001){
            res.sendFile(__dirname + '/success.html');
        } else{
            res.sendFile(__dirname + '/failure.html');
        }
          
        response.on('data', function(data){
            console.log(JSON.parse(data));
          })
    })

    request.write(jsonData);
    request.end();
})


app.post('/failure', function(req,res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
    console.log('Server listening on port 3000');
 })