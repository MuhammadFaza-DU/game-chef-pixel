import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { signToken } from '../middleware/auth.js';

/** POST /api/auth/register */
export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, password wajib diisi' });
  }
  try {
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email sudah terdaftar' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ username, email, passwordHash });
    const token = signToken({ id: user.id, username: user.username });
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Kredensial salah' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Kredensial salah' });

    const token = signToken({ id: user.id, username: user.username });
    res.json({ user: { id: user.id, username: user.username }, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
