import { Router } from "express"
import {
    createPost,
    getAllPost,
    getMyPost,
    getPostById 
} from "../controllers/post.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/user.model"
import { upload } from "../models/uploads"

const router = Router()

// create post
router.post(
    "/create", 
    authenticate, 
    requireRole([Role.AUTHOR , Role.ADMIN]), 
    upload.single("image"),  // image kiyana namin thama form data eke adala file eke name eka wenna oni (key name)
    createPost
)

// get all post
router.get("/", getAllPost)

// ADMIN, AUTHOR
router.get("/me", authenticate, requireRole([Role.AUTHOR , Role.ADMIN]), getMyPost)

router.get("/:id", getPostById)

export default router