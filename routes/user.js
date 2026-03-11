import express from "express"
import pool from "../config/db.js"
import bycrypt from "bcrypt"
import {body, param, validationResult} from "express-validator"
import session from "express-session"

const router = express.Router()

router.get("/login",(req,res) => {
    res.render("login.njk")
})

router.post("/login",
    body("username").trim().notEmpty().withMessage("Användarnamn krävs"),
    body("password").notEmpty().withMessage("Lösenord krävs")
    ,async (req,res,next) =>{
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()})
            }
            const {username, password} = req.body

            const [rows] = await pool.query(`SELECT * FROM user WHERE name = ?`, [username])
            const user = rows[0]

            if (!user) {
                return res.status(400).json({ error: "Usern finns inte i databasen"})
            }

            const isMatch = await bycrypt.compare(password,user.password_hash)
            if (!isMatch) {
                return res.status(400).json({ error: "Incorrect lösenord eller användarnamn"})
            }

            //Om allt fungerar så:
            req.session.userId = user.id
            req.session.userName = user.name
            req.session.authenticated = true

            console.log(req.session)

            return res.redirect("/users/profile")

            // const {username, password} = req.body

            // res.json({a:username,b:password})
        }
        catch(err) {
            console.error(err)
            res.status(500).json({ error: "Något gick fel"})
        }
})

router.get("/profile",(req,res) =>  {
    if (!req.session.authenticated) {
        return res.status(401).json({error:"Du måste vara inloggad för att se denna sida"})
    }
    res.json({message: "Välkommen till din profil!", user: req.session})
})

router.get("/testHash/:password", async (req,res) => {
    const password = req.params.password
    const saltRounds = 10
    const hash = await bycrypt.hash(password,saltRounds)
    res.send(`password: ${password} hash: ${hash}`)
})

export default router