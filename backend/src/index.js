// Fix for Railway: convert postgresql:// to postgres:// if needed
// This must happen BEFORE PrismaClient is imported
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('postgresql://', 'postgres://');
  console.log('✅ Converted DATABASE_URL protocol from postgresql:// to postgres://');
}

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

// Create Prisma client with explicit connection string if needed
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

const app = express();
// CORS configuration - allow all origins for now (можно ограничить конкретными доменами)
app.use(cors({
  origin: true, // Разрешить все источники
  credentials: true
}));
app.use(express.json());

const PORT = 3000;

// FAQ keywords mapping
const faqKeywords = [
  { keywords: ["где", "адрес"], faqField: "Где вы находитесь?" },
  { keywords: ["записаться", "приём", "прием"], faqField: "Как записаться на приём?" },
  { keywords: ["дни", "график", "работаете"], faqField: "В какие дни работает клиника?" },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Neuro backend is running");
});

// GET /faq - возвращает активные FAQ
app.get("/faq", async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
    });
    res.json(faqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch FAQ" });
  }
});

// POST /ask - сохранить вопрос пациента
app.post("/ask", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Question text is required" });
    }

    const question = await prisma.patientQuestion.create({
      data: { text },
    });

    res.status(201).json({
      message: "Question saved",
      question,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save question" });
  }
});

// GET /questions - получить все вопросы
app.get("/questions", async (req, res) => {
  try {
    const questions = await prisma.patientQuestion.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// PATCH /questions/:id/answer - ответ врача
app.patch("/questions/:id/answer", async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim() === "") {
      return res.status(400).json({ error: "Answer is required" });
    }

    const updated = await prisma.patientQuestion.update({
      where: { id },
      data: { answer, status: "answered" },
    });

    res.json({ message: "Answer saved", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

// POST /chat - чат-бот
app.post("/chat", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") return res.status(400).json({ error: "Message text is required" });

    const faqs = await prisma.faq.findMany({ where: { isActive: true } });

    const lowerText = text.toLowerCase();

    // Проверка ключевых слов
    const matchedKeyword = faqKeywords.find(f =>
      f.keywords.some(k => lowerText.includes(k))
    );

    if (matchedKeyword) {
      const faqAnswer = faqs.find(f => f.question === matchedKeyword.faqField);
      if (faqAnswer) return res.json({ source: "FAQ", answer: faqAnswer.answer });
    }

    // Если не найдено — сохраняем вопрос
    const question = await prisma.patientQuestion.create({ data: { text } });

    res.json({ source: "PatientQuestion", message: "Question saved for doctor review", question });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
