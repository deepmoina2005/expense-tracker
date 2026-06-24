const authService = require('../services/authService');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../validators/authValidator');

const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const user = await authService.createUser(validatedData);
        
        const token = authService.generateToken(user.id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
            token
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { user, token } = await authService.loginUser(validatedData.email, validatedData.password);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const validatedData = updateProfileSchema.parse(req.body);
        const user = await authService.updateProfile(req.user.id, validatedData);
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, error: error.errors[0].message });
        }
        next(error);
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateProfile
};
