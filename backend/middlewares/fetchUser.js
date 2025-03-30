const secretKey = "MilestoneProject";
const jwt = require("jsonwebtoken");

module.exports.fetchUser = async(req, res) =>{
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Unauthorized access", 
        status: "error"});
    }
    try {
            const decoded = jwt.verify(token, secretKey);
            req.user = await User.findById(decoded.id).select("-password"); // Attach user info to request
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }
        next();
        } catch (error) {
            res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    /* jwt.verify(token, secretKey, (err, decoded) =>{
        if (err){
            return res.
            status(401)
            .json({ message: "Unauthorized access", status: "error"});
        }
        req.user = decoded.user;

        next();
    }); */
};