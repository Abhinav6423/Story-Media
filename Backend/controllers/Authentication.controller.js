import User from "../modals/User.modal.js";
import Userstats from "../modals/Userstats.modal.js";


const setTokenInCookie = (res, token) => {
    res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    })
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password, profilePic } = req.body
        if (!username || !email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User already exists"
                }
            )
        }

        const user = await User.create(
            {
                username,
                email,
                password,
                profilePic
            }
        )

        await Userstats.create(
            {
                userId: user._id,
                username: user.username,
            }
        )

        return res.status(201).json(
            {
                success: true,
                message: "User registered successfully",
                user
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        const userExists = await User.findOne({ email })

        if (!userExists) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User does not exist"
                }
            )
        }

        const isMatch = await userExists.isPasswordCorrect(password)

        if (!isMatch) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Invalid credentials"
                }
            )
        }

        const token = await userExists.generateToken()

        setTokenInCookie(res, token)



        return res.status(200).json(
            {
                success: true,
                message: "User logged in successfully",
                user: {
                    id: userExists._id,
                    username: userExists.username,
                    email: userExists.email,
                    profilePic: userExists.profilePic
                },
                token
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json(
            {
                success: true,
                message: "User logged out successfully"
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(400).json(
                {
                    success: false,
                    message: "You are Unauthorized"
                }
            )
        }
        const user = await User.findById(userId).select("-password")
        return res.status(200).json(
            {
                success: true,
                user: user
            }
        )
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: error.message
            }
        )
    }
}

export { registerUser, loginUser, logoutUser, getLoggedInUser }