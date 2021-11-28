const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const api = require('./routes/api');

app.use(cors());
app.use(bodyParser.json());
app.use('/api',api);
app.get('/',(req,res)=>{
    res.send('Hello');
})

app.listen(3000,()=>{
    console.log('Server running on localhost:3000');
})
