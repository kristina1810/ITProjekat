const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { poolPromise } = require("../db");

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone } = req.body;

        const pool = await poolPromise;

        const existingUser = await pool
            .request()
            .input("email", email)
            .query("SELECT * FROM users WHERE email = @email");

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({
                message: "Email već postoji."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool
            .request()
            .input("first_name", first_name)
            .input("last_name", last_name)
            .input("email", email)
            .input("password_hash", hashedPassword)
            .input("phone", phone)
            .query(`
                INSERT INTO users
                (first_name, last_name, email, password_hash, phone, role_id)
                VALUES
                (@first_name, @last_name, @email, @password_hash, @phone, 2)
            `);

        res.status(201).json({
            message: "Registracija uspješna."
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("email", email)
            .query("SELECT * FROM users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(400).json({
                message: "Korisnik ne postoji."
            });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(400).json({
                message: "Pogrešna lozinka."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login uspješan.",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    register,
    login
};