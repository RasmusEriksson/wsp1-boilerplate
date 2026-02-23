import express from "express"
import pool from "../config/db.js"

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const [rows] = await pool.query(`
            SELECT post.id, post.title, post.created_at, user.name
            FROM post 
            JOIN user ON post.user_id = user.id
            ORDER BY post.created_at DESC
            `)
        res.render("posts.njk", {
            title:"Blogposts!",
            rows:rows
        })
    }
    catch (err) {
        next(err)
    }
})

router.get("/:id", async (req,res,next) => {
    try {
        const postId = req.params.id
        if (!Number.isInteger(Number(postId))) {
            throw new Error("Id is not a valid integer");
            
        }

        const [row] = await pool.query(`
            SELECT post.id, post.title, post.created_at, user.name
            FROM post 
            JOIN user ON post.user_id = user.id
            WHERE post.id = ?
            `,[postId]
        )

        if (row.length === 0) {
            throw new Error("Post does not exist!")
        }

        res.render("posts.njk", {
            title:"Blogposts!",
            rows:row
        })

        console.log(row)
        
    }
    catch (err) {
        next(err)
    }
})

router.get('/error', (req, res) => {
    throw new Error('Test error')
})

export default router