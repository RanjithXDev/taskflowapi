import { Router } from 'express';
import { User } from '../models/User';

const router = Router();


router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});


router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;

    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

export default router;