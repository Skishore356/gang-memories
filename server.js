const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const PASSWORD = "our12forever"; // 🔐 Change if you want

// -------- PASSWORD CHECK --------
app.post("/auth", (req, res) => {
  if (req.body.password === PASSWORD) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

// -------- FILE STORAGE --------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// -------- UPLOAD API --------
app.post("/upload", upload.single("file"), async (req, res) => {
  const { author, event, description } = req.body;

const newMemory = {
  id: Date.now(),
  file: `/uploads/${req.file.filename}`,
  author,
  event,
  description,
  date: new Date(),
  likes: 0,
  comments: []
};

  const filePath = path.join(__dirname, "data", "memories.json");

  let data = [];
  if (fs.existsSync(filePath)) {
    data = await fs.readJson(filePath);
  }

  data.push(newMemory);
  await fs.writeJson(filePath, data, { spaces: 2 });

  res.sendStatus(200);
});

// -------- GET MEMORIES --------
app.get("/memories", async (req, res) => {
  const filePath = path.join(__dirname, "data", "memories.json");

  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = await fs.readJson(filePath);
  res.json(data);
});

// -------- START SERVER --------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ---- LIKE MEMORY ----
app.post("/like/:id", async (req, res) => {
  const filePath = path.join(__dirname, "data", "memories.json");
  const data = await fs.readJson(filePath);

  const memory = data.find(m => m.id == req.params.id);
  if (memory) memory.likes++;

  await fs.writeJson(filePath, data, { spaces: 2 });
  res.sendStatus(200);
});

// ---- ADD COMMENT ----
app.post("/comment/:id", async (req, res) => {
  const { name, text } = req.body;

  const filePath = path.join(__dirname, "data", "memories.json");
  const data = await fs.readJson(filePath);

  const memory = data.find(m => m.id == req.params.id);
  if (memory) memory.comments.push({ name, text });

  await fs.writeJson(filePath, data, { spaces: 2 });
  res.sendStatus(200);
});