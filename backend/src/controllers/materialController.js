import prisma from '../lib/prisma.js';

// GET /api/materials  → list materials for the logged-in user
export const getMaterials = async (req, res) => {
  try {
    const materials = await prisma.studyMaterial.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ materials });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to fetch materials.' });
  }
};

// POST /api/materials  → create a new material
export const createMaterial = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const material = await prisma.studyMaterial.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        userId: req.user.userId,
      },
    });

    res.status(201).json({ material });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({ error: 'Failed to create material.' });
  }
};

// GET /api/materials/:id  → get one material
export const getMaterial = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const material = await prisma.studyMaterial.findFirst({
      where: {
        id,
        userId: req.user.userId, // security: only owner can see it
      },
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found.' });
    }

    res.json({ material });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Failed to fetch material.' });
  }
};

// DELETE /api/materials/:id
export const deleteMaterial = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // First check ownership
    const material = await prisma.studyMaterial.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found.' });
    }

    await prisma.studyMaterial.delete({ where: { id } });

    res.json({ message: 'Material deleted successfully.' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Failed to delete material.' });
  }
};