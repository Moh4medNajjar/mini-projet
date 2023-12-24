const express = require('express');
const router = express.Router();
const Task = require('../db/models/task');
// Get all tasks
router.get('/all', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//add a task
router.post('/add',  (req, res) => {
  let data = req.body
  let task = new Task(data);
  task.save().then((newTask) => {
    res.status(200).send(newTask);
  }).catch((err) => {
    res.status(400).send(err)
  })

});



// Update a task
router.put('/update/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/delete/:id', async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





module.exports = router;
