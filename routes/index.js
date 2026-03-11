import express from "express"
import pool from "../config/db.js"

const router = express.Router()

router.get("/", (req, res) => {
    console.log(req.session.userName)
    res.render("index.njk", {title: "starting page", username: req.session.userName})
})

router.get('/error', (req, res) => {
    throw new Error('Test error')
})

export default router