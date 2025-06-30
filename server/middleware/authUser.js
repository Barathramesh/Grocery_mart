import jwt from 'jsonwebtoken';

const authUser = async (req, res, next)=>{

   const token = req.cookies.token;

   if(!token) {
      return res.status(401).json({success:false, message:"Not Authorized"});
   }

   try {
     const tokendecode = jwt.verify(token, process.env.JWT_SECRET)
     req.userId = tokendecode.id;
     next();
   } catch (error) {
      return res.json({success:false, message: error.message});
   }
}

export default authUser;