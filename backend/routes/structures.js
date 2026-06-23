import express from 'express';
import Structure from '../models/Structure.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all structure types
// @route   GET /api/structures
// @access  Public
router.get('/', async (req, res) => {
  try {
    const structures = await Structure.find({});
    res.json(structures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single structure type
// @route   GET /api/structures/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const structure = await Structure.findById(req.params.id);
    if (structure) {
      res.json(structure);
    } else {
      res.status(404).json({ message: 'Structure not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a structure type
// @route   POST /api/structures
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, description, basePricePerSqFt, packages } = req.body;

  try {
    const structureExists = await Structure.findOne({ name });
    if (structureExists) {
      return res.status(400).json({ message: 'Structure type already exists' });
    }

    const structure = new Structure({
      name,
      description,
      basePricePerSqFt,
      packages
    });

    const createdStructure = await structure.save();
    res.status(201).json(createdStructure);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a structure type
// @route   PUT /api/structures/:id
// @access  Private
router.replaceOrUpdate = router.put('/:id', protect, async (req, res) => {
  const { name, description, basePricePerSqFt, packages } = req.body;

  try {
    const structure = await Structure.findById(req.params.id);

    if (structure) {
      structure.name = name || structure.name;
      structure.description = description || structure.description;
      structure.basePricePerSqFt = basePricePerSqFt !== undefined ? basePricePerSqFt : structure.basePricePerSqFt;
      if (packages) {
        structure.packages = packages;
      }

      const updatedStructure = await structure.save();
      res.json(updatedStructure);
    } else {
      res.status(404).json({ message: 'Structure not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a structure type
// @route   DELETE /api/structures/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const structure = await Structure.findById(req.params.id);

    if (structure) {
      await Structure.deleteOne({ _id: req.params.id });
      res.json({ message: 'Structure removed' });
    } else {
      res.status(404).json({ message: 'Structure not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
