const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const fictionalChar = [
    {id: 1, name: "Fenrys"},
    {id: 2, name: "Cardan"},
    {id: 3, name: "Milo"},
    {id: 4, name: "Kida"},
    {id: 5, name: "Sabrina"}
]

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/api/fictionalChar', (req, res) => {
    res.send(fictionalChar);
});

app.post('/api/fictionalChar', (req, res) => {
    const { error } =  validateChar(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    const character = {
        id: fictionalChar.length + 1,
        name: req.body.name
    };
    fictionalChar.push(character);
    setTimeout(() => {
        res.send(character);
    }, 5000);
    
});

app.get('/api/fictionalChar/:id', (req, res) => {
    const character = fictionalChar.find(c => c.id === parseInt(req.params.id)); 
    if (!character) res.status(404).send('The character with the given ID was not found.');
    res.send(character);
});

app.put('/api/fictionalChar/:id', (req, res) => {
    const character = fictionalChar.find(c => c.id === parseInt(req.params.id)); 
    if (!character) return res.status(404).send('The character with the given ID was not found.');

    const { error } =  validateChar(req.body); //result.error

    if(error) return res.status(400).send(error.details[0].message);

    character.name = req.body.name;
    res.send(character);
});

app.delete('/api/fictionalChar/:id', (req, res) => {
    const character = fictionalChar.find(c => c.id === parseInt(req.params.id)); 
    if (!character) return res.status(404).send('The character with the given ID was not found.');

    const index = fictionalChar.indexOf(character);
    fictionalChar.splice(index, 1);

    res.send(character)
});

function validateChar(character) {
    const schema = {
        name: Joi.string().min(2).required()
    };

    return Joi.validate(character, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))