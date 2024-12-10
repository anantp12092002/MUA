import { createUserService, loginService , verifyTokenService} from '../service/userService.js';


async function createUser(req, res) {
    const { name, email, password_hash } = req.body;
    try {
        const user = await createUserService(req);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user with Native pg' });
    }
}


async function login(req, res) {
    try {
        const token = loginService(req);
        res.cookie(token);
        res.json({ message:"User Login Success" });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users with Native pg' });
    }
}


async function verifyAndLogin(req, res) {
    const { token } = req.body; // JWT token sent in the request body

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const user = await verifyTokenService(token);
        res.json({ message: 'Authentication successful', user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

export { createUser, login, verifyAndLogin };
