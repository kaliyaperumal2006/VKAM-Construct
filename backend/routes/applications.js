import express from 'express';
import crypto from 'crypto';
import Application from '../models/Application.js';
import Structure from '../models/Structure.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Helper to generate reference ID
const generateReferenceId = () => {
  return `BC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

// @desc    Submit a project request (application)
// @route   POST /api/applications
// @access  Public
router.post('/', async (req, res) => {
  const {
    clientName,
    clientEmail,
    clientPhone,
    location,
    structureType,
    packageType,
    areaSqFt,
    preferences
  } = req.body;

  if (!clientName || !clientEmail || !clientPhone || !location || !structureType || !packageType || !areaSqFt) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find structure to fetch rates
    const structure = await Structure.findOne({ name: structureType });
    if (!structure) {
      return res.status(404).json({ message: `Structure type '${structureType}' not found` });
    }

    // Find the package multiplier
    const packageConfig = structure.packages.find(p => p.name === packageType);
    if (!packageConfig) {
      return res.status(404).json({ message: `Package level '${packageType}' not found` });
    }

    // Calculate cost
    const ratePerSqFt = structure.basePricePerSqFt * packageConfig.priceMultiplier;
    const approximateCost = Math.round(ratePerSqFt * areaSqFt);
    
    // Set budget range (e.g. -5% to +10%)
    const budgetMin = Math.round(approximateCost * 0.95);
    const budgetMax = Math.round(approximateCost * 1.10);

    let referenceId = generateReferenceId();
    // Ensure uniqueness
    let exists = await Application.findOne({ referenceId });
    while (exists) {
      referenceId = generateReferenceId();
      exists = await Application.findOne({ referenceId });
    }

    const application = new Application({
      referenceId,
      clientName,
      clientEmail,
      clientPhone,
      location,
      structureType,
      packageType,
      areaSqFt,
      approximateCost,
      budgetMin,
      budgetMax,
      preferences: preferences || '',
      status: 'Pending'
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Track application status
// @route   GET /api/applications/track/:referenceId
// @access  Public
router.get('/track/:referenceId', async (req, res) => {
  const refId = req.params.referenceId.trim().toUpperCase();
  try {
    const application = await Application.findOne({ referenceId: refId });
    if (application) {
      res.json({
        referenceId: application.referenceId,
        clientName: application.clientName,
        structureType: application.structureType,
        packageType: application.packageType,
        areaSqFt: application.areaSqFt,
        approximateCost: application.approximateCost,
        budgetMin: application.budgetMin,
        budgetMax: application.budgetMax,
        status: application.status,
        adminNotes: application.adminNotes,
        preferences: application.preferences,
        assignedEngineer: application.assignedEngineer,
        progressLogs: application.progressLogs,
        messages: application.messages || [],
        createdAt: application.createdAt
      });
    } else {
      res.status(404).json({ message: 'Application request not found. Check reference ID.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all applications (with status and search filter)
// @route   GET /api/applications
// @access  Private
router.get('/', protect, async (req, res) => {
  const { status, search } = req.query;
  const query = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { clientName: { $regex: search, $options: 'i' } },
      { clientEmail: { $regex: search, $options: 'i' } },
      { referenceId: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      res.json(application);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update application (status, adminNotes, and approximateCost)
// @route   PUT /api/applications/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status, adminNotes, approximateCost, budgetMin, budgetMax, assignedEngineer } = req.body;

  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      if (status) application.status = status;
      if (adminNotes !== undefined) application.adminNotes = adminNotes;
      if (approximateCost !== undefined) application.approximateCost = approximateCost;
      if (budgetMin !== undefined) application.budgetMin = budgetMin;
      if (budgetMax !== undefined) application.budgetMax = budgetMax;
      if (assignedEngineer) application.assignedEngineer = assignedEngineer;

      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      await Application.deleteOne({ _id: req.params.id });
      res.json({ message: 'Application request removed' });
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add progress log entry to application
// @route   POST /api/applications/:id/progress
// @access  Private
router.post('/:id/progress', protect, async (req, res) => {
  const { stage, description, imageUrl } = req.body;

  if (!stage || !description) {
    return res.status(400).json({ message: 'Stage and description are required' });
  }

  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      application.progressLogs.push({
        stage,
        description,
        imageUrl: imageUrl || ''
      });

      const updatedApplication = await application.save();
      res.status(201).json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Engineer login via username and password
// @route   POST /api/applications/engineer/login
// @access  Public
router.post('/engineer/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const applications = await Application.find({
      'assignedEngineer.username': username.trim(),
      'assignedEngineer.password': password.trim()
    });

    if (applications && applications.length > 0) {
      res.json({
        username: username.trim(),
        projects: applications
      });
    } else {
      res.status(401).json({ message: 'Invalid engineer credentials.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Accept project assignment
// @route   POST /api/applications/engineer/:referenceId/accept
// @access  Public (Validated by reference ID)
router.post('/engineer/:referenceId/accept', async (req, res) => {
  const refId = req.params.referenceId.trim().toUpperCase();
  try {
    const application = await Application.findOne({ referenceId: refId });
    if (application) {
      application.assignedEngineer.accepted = true;
      const updatedApplication = await application.save();
      res.json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Project not found.' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get project details for engineer workspace login
// @route   GET /api/applications/engineer/:referenceId
// @access  Public (Validated by reference ID)
router.get('/engineer/:referenceId', async (req, res) => {
  const refId = req.params.referenceId.trim().toUpperCase();
  try {
    const application = await Application.findOne({ referenceId: refId });
    if (application) {
      // Check if project has an assigned engineer
      if (!application.assignedEngineer || !application.assignedEngineer.name) {
        return res.status(400).json({ message: 'No engineer is assigned to this project yet.' });
      }
      res.json(application);
    } else {
      res.status(404).json({ message: 'Project not found. Please verify the Reference ID.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add progress log entry via engineer workspace
// @route   POST /api/applications/engineer/:referenceId/progress
// @access  Public (Validated by reference ID)
router.post('/engineer/:referenceId/progress', async (req, res) => {
  const refId = req.params.referenceId.trim().toUpperCase();
  const { stage, description, imageUrl } = req.body;

  if (!stage || !description) {
    return res.status(400).json({ message: 'Stage and description are required' });
  }

  try {
    const application = await Application.findOne({ referenceId: refId });

    if (application) {
      application.progressLogs.push({
        stage,
        description,
        imageUrl: imageUrl || ''
      });

      const updatedApplication = await application.save();
      res.status(201).json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Add chat message via engineer or client
// @route   POST /api/applications/engineer/:referenceId/messages
// @access  Public (Validated by reference ID)
router.post('/engineer/:referenceId/messages', async (req, res) => {
  const refId = req.params.referenceId.trim().toUpperCase();
  const { sender, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  // Restrict sender to Engineer or Client (Admin has own protected route, but can fall back)
  const finalSender = (sender === 'Client' || sender === 'Engineer' || sender === 'Admin') ? sender : 'Engineer';

  try {
    const application = await Application.findOne({ referenceId: refId });

    if (application) {
      application.messages.push({
        sender: finalSender,
        message,
        date: new Date()
      });

      const updatedApplication = await application.save();
      res.status(201).json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Add admin chat message
// @route   POST /api/applications/:id/messages
// @access  Private (Admin only)
router.post('/:id/messages', protect, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const application = await Application.findById(req.params.id);

    if (application) {
      application.messages.push({
        sender: 'Admin',
        message,
        date: new Date()
      });

      const updatedApplication = await application.save();
      res.status(201).json(updatedApplication);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
