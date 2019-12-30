import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import getValue from 'get-value';
import * as path from 'path';

const publicKey = fs.readFileSync(
  path.resolve(__dirname, '../../credential/jwt-public.key'),
);
function auth(req, res, next) {
  const authorization = getValue(req, 'headers.authorization', {
    default: ' ',
  });
  const token = authorization.split(' ')[1];
  if (authorization && token) {
    jwt.verify(token, publicKey, { algorithm: 'RS256' }, (error, decode) => {
      if (error) {
        req.user = undefined;
      } else {
        req.user = decode;
      }
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
}
export default auth;
