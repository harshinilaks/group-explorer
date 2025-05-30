import express from 'express';
import Group from '../models/Group.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, description, members, cayleyTable, identity, cycleGroups } = req.body;
  const newGroup = new Group({ name, description, members, cayleyTable, identity, cycleGroups });

  try {
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
