const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

router.use(express.json());

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// Create a new task
router.post('/', async (req, res) => {
    const task = new Task(req.body);
    try {
      const newTask = await task.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get all tasks
  router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update a task
  router.put('/:title', async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { title: req.params.title },
        req.body,
        { new: true }
      );
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a task
  router.delete('/:title', async (req, res) => {
    try {
      await Task.deleteOne({ title: req.params.title });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;