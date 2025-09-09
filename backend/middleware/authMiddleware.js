import jwt from 'jsonwebtoken'

const protect = (req,res,next)=>{

    try{

        // get the token from the cookie 
        const token = req.cookies.authToken;
        if(!token)
                return res.status(401).json({message:"Access denied no token provided"});
        // else varify the token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        // attach user info to the request object.
        req.user = decoded.user;
        next();
    }catch(error){
        console.error("Authentication Failed",error.message);

        // handle specific jwt errors
        if(error.name==='TokenExpiredError')
            return res.status(401).json({message:"Token expired , Please login again."})
        if(error.name==='JsonWebTokenError')
                return res.status(401).json({message:"Invalid Token"})
        return res.status(401).json({message:"Authentication failed"})
    }
}


export {protect}