import express from "express"
import pool from "../config/db.js"

const router = express.Router()

router.get("/", (req, res) => {
    res.render("index.njk", {title: "starting page"})
})

router.get('/error', (req, res) => {
    throw new Error('Test error')
})

export default router