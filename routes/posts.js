import express from "express"
import pool from "../config/db.js"
import {body, param, validationResult} from "express-validator"

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

router.get("/:id",
    param("id").isInt().withMessage("Id måste vara heltal"), async (req,res,next) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array()})
        }

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
        
    }
    catch (err) {
        next(err)
    }
})

/*
router.post("/",
    body("content").trim().escape().withMessage("Innehållet är ogiltigt"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({errors: errors})
            }

            const content = req.body.content

            const [result] = await pool.query(
                    `INSERT INTO post (content, user_id)
                    VALUES (?,?)`,
                    [content, req.user.id]
                )
            
            res.status(201).json({postId: result.insertId})
        }
        catch (err) {
            next(err)
        }
    }
)
*/
router.get('/error', (req, res) => {
    throw new Error('Test error')
})

export default router