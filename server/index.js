const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const EXTERNAL = process.env.EXTERNAL_API_URL; // e.g. https://api.example.com/chat
const API_KEY = process.env.API_KEY; // your secret key stored on the server

if(!EXTERNAL){
  console.warn('Warning: EXTERNAL_API_URL not set. Proxy will return 500 for requests.');
}

app.post('/api/proxy', async (req,res)=>{
  try{
    if(!EXTERNAL) return res.status(500).json({error:'EXTERNAL_API_URL not configured on server'});
    const body = req.body || {};

    // Forward request to external API; attach X-API-KEY from server env
    const r = await fetch(EXTERNAL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY || ''
      },
      body: JSON.stringify(body)
    });

    const text = await r.text();
    // Try to parse json, otherwise return text
    try{ const json = JSON.parse(text); return res.status(r.status).json(json); }catch(e){ return res.status(r.status).send(text); }
  }catch(err){
    console.error(err);res.status(500).json({error:err.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('Proxy listening on',PORT));
