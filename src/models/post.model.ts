import mongoose, { Document, Schema } from "mongoose"

// 1. model eka thamai mulinma hadanna oni

export interface IPost extends Document {
    _id: mongoose.Types.ObjectId
    title: string
    content: string
    author: mongoose.Types.ObjectId
    imageURL?: string
    tags?: string[]
    createdAt?: Date
    updatedAt?: Date
}

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },  // ref: "User" -> relationship ekak wage habay methanadi daanne reference ekak wage
        imageURL: String,
        tags: [String]
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model<IPost>("Post", PostSchema)