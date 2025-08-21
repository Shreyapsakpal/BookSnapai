import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

function parseJsonArray(maybeArray) {
	if (Array.isArray(maybeArray)) return maybeArray;
	try { const v = JSON.parse(maybeArray); return Array.isArray(v) ? v : []; } catch { return []; }
}

function parseJsonObject(maybeObject) {
	if (maybeObject && typeof maybeObject === 'object') return maybeObject;
	try { const v = JSON.parse(maybeObject); return v && typeof v === 'object' ? v : {}; } catch { return {}; }
}
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function generateToken(user) {
	return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.userId = payload.userId;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
	try {
		const { email, name, password, role } = req.body;
		if (!email || !password || !name) {
			return res.status(400).json({ error: 'Missing fields' });
		}
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			return res.status(409).json({ error: 'Email already in use' });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				email,
				name,
				passwordHash,
				role: role && ['super_admin','admin','educator','student'].includes(role) ? role : 'student',
				joinDate: new Date(),
				streak: 0,
				totalScans: 0,
				preferencesJson: JSON.stringify({
					theme: 'system',
					notifications: true,
					autoSync: true,
					language: 'en',
					privacy: { shareScans: false, allowFriendRequests: true, showActivity: true }
				}),
				friendsJson: JSON.stringify([])
			}
		});
		const token = generateToken(user);
		return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, joinDate: user.joinDate, streak: user.streak, totalScans: user.totalScans, preferences: parseJsonObject(user.preferencesJson) } });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'Server error' });
	}
});

app.post('/api/auth/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return res.status(401).json({ error: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = generateToken(user);
		return res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, joinDate: user.joinDate, streak: user.streak, totalScans: user.totalScans, preferences: parseJsonObject(user.preferencesJson) } });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'Server error' });
	}
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
	const user = await prisma.user.findUnique({ where: { id: req.userId } });
	if (!user) return res.status(404).json({ error: 'Not found' });
	return res.json({ id: user.id, email: user.email, name: user.name, role: user.role, joinDate: user.joinDate, streak: user.streak, totalScans: user.totalScans, preferences: parseJsonObject(user.preferencesJson) });
});

// Books routes
app.get('/api/books', authMiddleware, async (req, res) => {
	const books = await prisma.book.findMany({ where: { userId: req.userId }, include: { pages: true } });
	const mapped = books.map(b => ({
		...b,
		tags: parseJsonArray(b.tagsJson),
		concepts: parseJsonArray(b.conceptsJson),
		pages: b.pages.map(p => ({
			...p,
			aiKeyPoints: parseJsonArray(p.aiKeyPointsJson),
			aiConcepts: parseJsonArray(p.aiConceptsJson)
		}))
	}));
	return res.json(mapped);
});

app.post('/api/books', authMiddleware, async (req, res) => {
	const { title, author, tags, isPublic } = req.body;
	if (!title) return res.status(400).json({ error: 'Title required' });
	const book = await prisma.book.create({
		data: {
			title,
			author: author || null,
			scanDate: new Date(),
			userId: req.userId,
			totalPages: 0,
			tagsJson: JSON.stringify(Array.isArray(tags) ? tags : []),
			conceptsJson: JSON.stringify([]),
			isPublic: Boolean(isPublic),
		}
	});
	return res.status(201).json({ ...book, tags: parseJsonArray(book.tagsJson), concepts: parseJsonArray(book.conceptsJson) });
});

app.get('/api/books/:id', authMiddleware, async (req, res) => {
	const book = await prisma.book.findFirst({ where: { id: req.params.id, userId: req.userId }, include: { pages: true } });
	if (!book) return res.status(404).json({ error: 'Not found' });
	return res.json({
		...book,
		tags: parseJsonArray(book.tagsJson),
		concepts: parseJsonArray(book.conceptsJson),
		pages: book.pages.map(p => ({
			...p,
			aiKeyPoints: parseJsonArray(p.aiKeyPointsJson),
			aiConcepts: parseJsonArray(p.aiConceptsJson)
		}))
	});
});

// Upload/Scan route: store file and create a page under a book
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `${uniqueSuffix}${ext}`);
	}
});
const upload = multer({ storage });

app.post('/api/scan/upload', authMiddleware, upload.single('file'), async (req, res) => {
	try {
		const { bookId, pageNumber } = req.body;
		if (!req.file) return res.status(400).json({ error: 'File is required' });
		const fileUrl = `/uploads/${req.file.filename}`;
		let book;
		if (bookId) {
			book = await prisma.book.findFirst({ where: { id: bookId, userId: req.userId } });
			if (!book) return res.status(404).json({ error: 'Book not found' });
		} else {
			book = await prisma.book.create({
				data: {
					title: req.file.originalname.replace(path.extname(req.file.originalname), ''),
					scanDate: new Date(),
					userId: req.userId,
					totalPages: 0,
					tagsJson: JSON.stringify([]),
					conceptsJson: JSON.stringify([]),
					isPublic: false,
				}
			});
		}
		const nextPage = pageNumber ? parseInt(pageNumber, 10) : (await prisma.bookPage.count({ where: { bookId: book.id } })) + 1;
		const page = await prisma.bookPage.create({
			data: {
				bookId: book.id,
				pageNumber: nextPage,
				imageUrl: fileUrl,
				ocrText: '',
				aiSummary: '',
				aiKeyPointsJson: JSON.stringify([]),
				aiConceptsJson: JSON.stringify([]),
				difficulty: 'medium'
			}
		});
		await prisma.book.update({ where: { id: book.id }, data: { totalPages: await prisma.bookPage.count({ where: { bookId: book.id } }) } });
		return res.status(201).json({ bookId: book.id, page });
	} catch (e) {
		console.error(e);
		return res.status(500).json({ error: 'Server error' });
	}
});

// Users (admin) route: list users
app.get('/api/users', authMiddleware, async (req, res) => {
	const me = await prisma.user.findUnique({ where: { id: req.userId } });
	if (!me || (me.role !== 'super_admin' && me.role !== 'admin')) {
		return res.status(403).json({ error: 'Forbidden' });
	}
	const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, joinDate: true, streak: true, totalScans: true } });
	return res.json(users);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});