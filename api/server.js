// IMPORTS AT THE TOP
const express = require('express')
const Dog = require('./dog-model.js')
// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS



// [GET]    /             (Hello World endpoint)
server.get('/hello-world', (req, res) => {
    res.status(200).json({ message: 'Hello, world' })
})
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
server.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.findAll();
        console.log(dogs)
        res.status(200).json(dogs)
    } catch(err) {
        res.status(500).json({ message: `something horrible happened` })
    }
})
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get('/api/dogs/:id', async (req, res) => {
    
    try {
        const { id } = req.params;
        const dog = await Dog.findById(id)
        if(!dog) {
            res.status(404).json({ message: `No dog with the id ${id} is found`})
        }
        res.status(200).json(dog)
    } catch(err) {
        res.status(500).json({ message: `Error fetching dog` })
    }
})
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post('/api/dogs', async (req, res) => {
    try {
        const { name, weight } = req.body;
        if(!name || !weight) {
            res.status(422).json({
                message: `dogs need name and weight`
            })
        } else {
            const created = await Dog.create({ name, weight })
        res.status(201).json({
            message: `Success creating dog!`,
            data: created
        })
        }
        
    } catch(err) {
        res.status(500).json({ message: `Error creating dogs` })
    }
})
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, weight } = req.body
        if (!name || !weight) {
            res.status(422).json({
                message: "dogs need name and weight"
            })
        } else {
            let updatedDog = await Dog.update(id, { name, weight })
            if (!updatedDog) {
                res.status(404).json({
                    message: `dog with id ${id} not found`
                })
            } else {
                res.status(200).json({
                    message: `Success updating dog`,
                    data: updatedDog,
                })
            }
            
        }
        
    } catch (err) {
        res.status(500).json({
            message: `Errory updating dog: ${err.message}`
        })
    }
})
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete('api/dogs/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deletedDog = await Dog.delete(id);
        if (!deletedDog) {
            res.status(404).json({
                message: `Error: Dog with id ${id} not found`
            })
        } else {
            res.status(200).json({
                message: `Successfully deleted dog`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error deleting dog: ${err.message}`
        })
    }
})
// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
