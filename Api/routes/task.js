const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.deleteOne({ id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





router.put('/:id/assignTask', async (req, res) => {
    const taskId = req.params.id;
    const assigneeId = req.body.assigneeId;
  
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, 'owner._id': req.user._id }, // Ajoutez une condition pour s'assurer que le demandeur est le propriétaire
        { assigneeId },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found or user not authorized' });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  router.put('/:id/setPriority', async (req, res) => {
    const taskId = req.params.id;
    const priority = req.body.priority;
  
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { priority },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Définir le statut d'une tâche
  router.put('/:id/setStatus', async (req, res) => {
    const taskId = req.params.id;
    const status = req.body.status;
  
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { status },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });








router.put('/:id/addParticipants', async (req, res) => {
    const taskId = req.params.id;
    const participants = req.body.participants;
  
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId },
        { $addToSet: { participants: { $each: participants } } },
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
