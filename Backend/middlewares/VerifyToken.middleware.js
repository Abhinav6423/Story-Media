import User from "../modals/User.modal.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export default verifyToken;

