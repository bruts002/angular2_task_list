var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('{{dbconnection}}', ['tasks']);

// Get all tasks
router.get('/tasks', function(req, res, next) {
    db.tasks.find(function(err, tasks) {
        if (err) {
            res.send(err);
        }
        res.json(tasks);
    });
});

// Get single task
router.get('/tasks/:id', function(req, res, next) {
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, tasks) {
        if (err) {
            res.send(err);
        }
        res.json(tasks);
    });
});

// Save tasks
router.post('/tasks/', function(req, res, next) {
    var tasks = req.body;
    if (!tasks.title || !(tasks.isDone + '')) {
        res.status = 400;
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.tasks.save(tasks, function(err) {
            if (err) {
                res.send(err);
            }
            res.json(tasks);
        });
    }
});

// Delete single task
router.delete('/tasks/:id', function(req, res, next) {
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, tasks) {
        if (err) {
            res.send(err);
        }
        res.json(tasks);
    });
});

// Update single task
router.put('/tasks/:id', function(req, res, next) {
    var tasks = req.body;
    var updTasks = {};

    if (tasks.isDone) {
        updTasks.isDone = tasks.isDone;
    }
    if (tasks.title) {
        updTasks.title = tasks.title;
    }

    if (!updTasks) {
        res.status(400);
        res.json({"error":"Bad data"});
    } else {
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)},updTasks,{}, function(err, tasks) {
            if (err) {
                res.send(err);
            }
            res.json(tasks);
        });
    }
    
});

module.exports = router;
