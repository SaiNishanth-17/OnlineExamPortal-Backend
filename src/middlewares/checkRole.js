exports.checkRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'Access forbidden: User object missing (Authentication required first).' });
    }

    const userRole = req.user.role;

    if (!roles.includes(userRole)) {
        return res.status(403).json({
            message: 'Access forbidden: Insufficient privileges.',
            requiredRoles: roles,
            yourRole: userRole
        });
    }

    next();
};