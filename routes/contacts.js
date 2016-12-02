var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('{{dbconnection}}', ['contacts']);

// Get all contacts
router.get('/contacts', function(req, res, next) {
    db.contacts.find(function(err, contacts) {
        if (err) {
            res.send(err);
        }
        res.json(contacts);
    });
});

// Get single contacts
router.get('/contacts/:id', function(req, res, next) {
    db.contacts.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, contacts) {
        if (err) {
            res.send(err);
        }
        res.json(contacts);
    });
});

// Save contacts
router.post('/contacts/', function(req, res, next) {
    var contacts = req.body;
    if (!contacts.title || !(contacts.isDone + '')) {
        res.status = 400;
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.contacts.save(contacts, function(err) {
            if (err) {
                res.send(err);
            }
            res.json(contacts);
        });
    }
});

// Delete single contacts
router.delete('/contacts/:id', function(req, res, next) {
    db.contacts.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, contacts) {
        if (err) {
            res.send(err);
        }
        res.json(contacts);
    });
});

// Update single contacts
router.put('/contacts/:id', function(req, res, next) {
    var contacts = req.body;
    var updContacts = {};

    if (contacts.isDone) {
        updContacts.isDone = contacts.isDone;
    }
    if (contacts.title) {
        updContacts.title = contacts.title;
    }

    if (!updContacts) {
        res.status(400);
        res.json({"error":"Bad data"});
    } else {
        db.contacts.update({_id: mongojs.ObjectId(req.params.id)},updContacts,{}, function(err, contacts) {
            if (err) {
                res.send(err);
            }
            res.json(contacts);
        });
    }
    
});

module.exports = router;
