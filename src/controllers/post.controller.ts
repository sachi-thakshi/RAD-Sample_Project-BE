// 2 
// create post
// get all post
// get my post

import { Request, Response } from "express";
import { AUthRequest } from "../middleware/auth";
import { Post } from "../models/post.model";
import cloudinary from "../utils/cloudinary";

// api/v1/post/create
export const createPost = async ( req: AUthRequest, res: Response ) => {
    try{
        // req.user
        // { 
        //   sub: user._id.toString(), 
        //   roles: user.roles
        // }

        // req.user.sub  // sub -> token eka generate karanakota sub kiyana eke thama userId eka daagaththe - userId eka gannawa
        // req.user.roles

        const { title, content, tags } = req.body
        let imageURL = ""

        if (req.file) {
            // 1. you need to save image to cloudinary
            // 2. and get URL

            // 3. req.file?.buffer // file eka multer kiyana eke thiyenne eka ganne me widhata`
 
            // 4. save post to MongoDB
            // res.send(req.user)

            const result:any = await new Promise((resole, reject) =>{
                const upload_stream = cloudinary.uploader.upload_stream(
                    { folder:"posts" },
                    ( error, result ) => {
                        if (error) {
                            return reject(error)
                        }
                        resole(result) // success return
                    }
                )
                upload_stream.end(req.file?.buffer)
            })
            imageURL = result.secure_url
        }

        const newPost = new Post({
            title, 
            content, 
            tags: tags.split(","),
            imageURL,
            author:req.user.sub // from auth middleware
        })
        await newPost.save()

        res.status(201).json({ 
            message: "Post Created",
            data: newPost
        })
            
    } catch(error){
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// http://localhost:5000/api/v1/post?page=1&limit=10
// api/v1/post/
export const getAllPost = async ( req: Request, res: Response ) => {
    try {
      // pagination
      const page = parseInt(req.query.page as string) | 1
      const limit = parseInt(req.query.limit as string) | 10
      const skip = (page - 1) * limit

      const posts =  await Post.find()
        .populate("author",  "firstname email") // related model data
        .sort({ createdAt: -1 }) // chnage order
        .skip(skip) // ignore data for pagination
        .limit(limit) // data count currently need

      const total = await Post.countDocuments()
      res.status(200).json({ 
        message: "Post Data",
        data: posts,
        totalPages: Math.ceil( total / limit),
        totalCount: total,
        page
     })

    } catch (error) {
        console.error("Error Fetching data:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

// api/v1/post/me
export const getMyPost = async ( req: AUthRequest, res: Response ) => {
    try {
    // pagination
    const page = parseInt(req.query.page as string) | 1
    const limit = parseInt(req.query.limit as string) | 10
    const skip = (page - 1) * limit;

    // find only posts created by current user
    const posts = await Post.find({ author: req.user.sub })
    //   .populate("author", "firstname email") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments({ author: req.user.sub })

    return res.status(200).json({
      message: "My Posts",
      data: posts,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    })
  } catch (error) {
    console.error("Error fetching my posts:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id).populate("author", "firstname email")
    if (!post) return res.status(404).json({ message: "Post not found" })
    return res.status(200).json({ data: post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

// Setup routes
// You need update index.ts
// new file need create inside routes package and add 3 routes