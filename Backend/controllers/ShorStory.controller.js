import ShortStory from "../modals/Shortstory.modal.js"
import Userstats from "../modals/Userstats.modal.js";
import Userhistory from "../modals/Userhistory.modal.js";
// creator panel
const createShortStory = async (req, res) => {
    try {
        const {
            title,
            story,
            description,
            coverImage,
            finalQuestion,
            category,
            status,
            finalAnswer
        } = req.body;

        if (!title || !story || !description || !coverImage || !finalQuestion || !category || !finalAnswer) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const shortStory = await ShortStory.create({
            title,
            story,
            description,
            coverImage,
            finalQuestion,
            category,
            author: req.user._id,
            status: status || "draft",
            finalAnswer : finalAnswer
        });

        await Userstats.findOneAndUpdate({ userId: req.user._id },
            {
                $inc: {
                    totalShortStoriesCreated: 1,
                    xp: 30


                }
            }
        );

        return res.status(201).json({
            success: true,
            message: "Short story created successfully",
            shortStory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const listUserShortStory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, title, category } = req.query;

        const filter = { author: userId };

        if (status) {
            filter.status = status;
        }

        title && (filter.title = { $regex: title, $options: "i" }); // 👈 case-insensitive
        category && (filter.category = category)

        const shortStory = await ShortStory
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            shortStory
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const openUserShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            })
        }

        const shortStoryExists = await ShortStory.findById(storyId)
        if (!shortStoryExists) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            })
        }

        if (shortStoryExists.author.toString() !== userId.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        return res.status(200).json({
            success: true,
            ShortStory: shortStoryExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { title, story, description, coverImage, finalQuestion, category, status } = req.body;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        if (shortStory.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (status && !["draft", "published"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        // ✅ update only provided fields
        if (title !== undefined) shortStory.title = title;
        if (story !== undefined) shortStory.story = story;
        if (description !== undefined) shortStory.description = description;
        if (coverImage !== undefined) shortStory.coverImage = coverImage;
        if (finalQuestion !== undefined) shortStory.finalQuestion = finalQuestion;
        if (category !== undefined) shortStory.category = category;
        if (status !== undefined) shortStory.status = status;

        // ✅ check if anything changed
        if (!shortStory.isModified()) {
            return res.status(400).json({
                success: false,
                message: "No changes provided"
            });
        }

        await shortStory.save();

        return res.status(200).json({
            success: true,
            message: "Short story updated successfully",
            shortStory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const deleteShortStory = async (req, res) => {
    try {
        const { storyId } = req.params;

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory) {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        if (shortStory.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await ShortStory.findByIdAndDelete(storyId);

        await Userstats.findOneAndUpdate(
            { userId: req.user._id },
            {
                $inc: {
                    totalShortStoriesCreated: -1,
                    xp: -30
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Short story deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




// Home Feed 
const listShortStory = async (req, res) => {
    try {
        const { category, title } = req.query
        const filter = {};
        if (category) {
            filter.category = category
        }
        if (title) {
            filter.title = { $regex: title, $options: "i" }; // 👈 case-insensitive
        }

        filter.status = "published"

        const shortStory = await ShortStory.find(filter)
        return res.status(200).json({
            success: true,
            shortStory: shortStory
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const openShortStory = async (req, res) => {
    try {
        const { storyId } = req.params

        if (!storyId) {
            return res.status(400).json({
                success: false,
                message: "storyId is required"
            })
        }

        const userId = req.user._id

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const shortStory = await ShortStory.findById(storyId)


        return res.status(200).json({
            success: true,
            ShortStory: shortStory
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const userAnswer = async (req, res) => {
    try {
        const { storyId } = req.params;
        const { answer } = req.body;
        const userId = req.user._id;

        if (!storyId || !answer) {
            return res.status(400).json({
                success: false,
                message: "storyId and answer are required"
            });
        }

        const shortStory = await ShortStory.findById(storyId);

        if (!shortStory || shortStory.status !== "published") {
            return res.status(404).json({
                success: false,
                message: "Short story not found"
            });
        }

        // Normalize answers
        const correctAnswer = shortStory.finalAnswer.trim().toLowerCase();
        const userAnswer = answer.trim().toLowerCase();

        if (correctAnswer !== userAnswer) {
            return res.status(403).json({
                success: false,
                message: "Wrong answer"
            });
        }

        // Prevent XP farming
        const alreadyAnswered = await Userhistory.findOne({
            userId,
            storyId
        });

        if (alreadyAnswered) {
            return res.status(400).json({
                success: false,
                message: "You already completed this story"
            });
        }

        // Record completion
        await Userhistory.create({
            reader: userId,
            contentId: storyId,
            contentType: "shortStory"
        });

        await Userstats.findOneAndUpdate(
            { userId },
            {
                $inc: {
                    xp: 20,
                    totalShortStoriesRead: 1
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "Correct answer! XP awarded 🎉"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};






export { createShortStory, listShortStory, openShortStory, updateShortStory, deleteShortStory, listUserShortStory, openUserShortStory, userAnswer } 