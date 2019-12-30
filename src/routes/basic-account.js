import { Router } from 'express';
import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import get from 'get-value';
import * as path from 'path';

const router = new Router();
const privateKey = fs.readFileSync(
  path.resolve(__dirname, '../../credential/jwt-private.key'),
);
router.post('/login', (req, res) => {
  const username = get(req, 'body.username');
  const password = get(req, 'body.password');
  if (!username || !password) {
    return res.json({ code: 0, messages: ['invalid params'] });
  }
  /** @TODO do login here */

  // fake user
  const user = {
    id: 1,
    email: 'someemail@gmail.com',
    displayName: 'nobody',
    imageUrl: '/img/a.jpg',
  };

  const token = jwt.sign(user, privateKey, {
    expiresIn: '1h',
    algorithm: 'RS256',
  });
  return res.json({
    code: 1,
    data: { token },
  });
});

export default router;
