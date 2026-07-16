// Must run after `protect` — relies on req.user being populated from the JWT.
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'هذا الإجراء متاح لمسؤولي المنصة فقط' });
  }
  return next();
};
