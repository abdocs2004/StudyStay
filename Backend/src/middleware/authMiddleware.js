import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'studystaysecretjwtkey123!@#');
      req.user = decoded; // payload has: id, email, role
      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'غير مصرح، الرمز غير صالح أو انتهت صلاحيته' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'غير مصرح، الرجاء تسجيل الدخول أولاً' });
  }
};

// Like `protect`, but never rejects the request. Attaches req.user when a
// valid token is present, leaves it undefined otherwise. Used on public
// routes that want to show extra data to an authenticated/owning user
// (e.g. a pending property preview) without requiring login for everyone.
export const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'studystaysecretjwtkey123!@#');
    } catch (error) {
      // Invalid/expired token on a public route — just proceed as a guest.
      req.user = undefined;
    }
  }
  return next();
};
