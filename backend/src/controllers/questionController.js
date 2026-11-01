// backend/src/controllers/questionController.js
import prisma from '../lib/prisma.js';
import { askJSON } from '../lib/ai.js';

// POST /api/questions/generate/\:materialId
// Body (optional): { difficulty: 'easy' | 'medium' | 'hard', numQuestions: 5 }
export const generateQuestions = async (req, res) => {
  try {
    const materialId = parseInt(req.params.materialId);
    const { difficulty = 'medium', numQuestions = 5 } = req.body || {};

    // 1. Verify the material exists AND belongs to the logged-in user
    const material = await prisma.studyMaterial.findFirst({
      where: { id: materialId, userId: req.user.userId },
    });
    if (!material) {
      return res.status(404).json({ error: 'Study material not found.' });
    }

    // 2. Ask the AI to generate questions (cap size to protect the free-tier quota)
    const content = material.content.slice(0, 15000);
    const prompt = `
Based on the following study material, generate exactly ${numQuestions} multiple-choice questions.

Study material title: "${material.title}"
Study material content:
"""
${content}
"""

Difficulty: ${difficulty}

Rules:
- Questions must be answerable from the material alone.
- Each question has exactly 4 options (A, B, C, D) with one correct answer.
- Include a short explanation of why the answer is correct.
- Vary which option letter is correct.

Respond with ONLY this JSON structure:
{
  "questions": [
    {
      "questionText": "string",
      "optionA": "string",
      "optionB": "string",
      "optionC": "string",
      "optionD": "string",
      "correctAnswer": "A" | "B" | "C" | "D",
      "explanation": "string"
    }
  ]
}
`.trim();

    const result = await askJSON(prompt);
    const questions = Array.isArray(result.questions) ? result.questions : [];

    if (questions.length === 0) {
      return res.status(502).json({ error: 'The AI returned no questions. Please try again.' });
    }

    // 3. Save the question set + questions to the database
    const questionSet = await prisma.questionSet.create({
      data: {
        title: `${material.title} — ${difficulty} (${new Date().toLocaleDateString()})`,
        mode: 'multiple-choice',
        difficulty,
        studyMaterialId: material.id,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json({ questionSet });
  } catch (error) {
    console.error('Generate questions error:', error);
    if (error instanceof SyntaxError) {
      return res.status(502).json({ error: 'The AI returned malformed data. Please try again.' });
    }
    res.status(500).json({ error: 'Failed to generate questions.' });
  }
};

// GET /api/questions/sets → list all question sets for the logged-in user
export const getQuestionSets = async (req, res) => {
  try {
    const questionSets = await prisma.questionSet.findMany({
      where: { studyMaterial: { userId: req.user.userId } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        mode: true,
        difficulty: true,
        createdAt: true,
        studyMaterialId: true,
        _count: { select: { questions: true } },
      },
    });
    res.json({ questionSets });
  } catch (error) {
    console.error('Get question sets error:', error);
    res.status(500).json({ error: 'Failed to fetch question sets.' });
  }
};

// GET /api/questions/sets/\:id → one question set with its questions
export const getQuestionSet = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const questionSet = await prisma.questionSet.findFirst({
      where: { id, studyMaterial: { userId: req.user.userId } },
      include: { questions: { orderBy: { id: 'asc' } } },
    });
    if (!questionSet) {
      return res.status(404).json({ error: 'Question set not found.' });
    }
    res.json({ questionSet });
  } catch (error) {
    console.error('Get question set error:', error);
    res.status(500).json({ error: 'Failed to fetch question set.' });
  }
};