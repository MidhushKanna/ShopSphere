import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET environment variable is missing in production!');
        }
        console.warn('WARNING: JWT_SECRET is not set in .env. Using default development secret.');
        return 'shopsphere_default_dev_jwt_secret_key_change_in_prod';
    }
    return process.env.JWT_SECRET;
};

export const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        getJwtSecret(),
        {
            expiresIn: '30d',
        }
    );
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, getJwtSecret(), (err, decode) => {
            if (err) {
                res.status(401).send({ message: "Invalid or expired token" });
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        res.status(401).send({ message: "No authentication token provided" });
    }
};



export const isAdmin = (req,res,next) => {
    if(req.user && req.user.isAdmin) {
        next();
    }
    else{
        res.status(401).send({message: "Invalid admin token"});
    }
}