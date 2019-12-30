function guard(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ code: 0, messages: ['Unauthorized user!'] });
}
export default guard;
