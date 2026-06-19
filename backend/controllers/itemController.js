const { poolPromise } = require("../db");

const createItem = async (req, res) => {
    try {
        const {
            title,
            description,
            item_type_id,
            category_id,
            location_id,
            lost_found_date,
            user_id
        } = req.body;

        const image_url = req.file ? req.file.filename : null;

        const pool = await poolPromise;

        await pool.request()
            .input("title", title)
            .input("description", description)
            .input("image_url", image_url)
            .input("item_type_id", item_type_id)
            .input("category_id", category_id)
            .input("location_id", location_id)
            .input("status_id", 1)
            .input("user_id", user_id)
            .input("lost_found_date", lost_found_date)
            .query(`
                INSERT INTO items
                (title, description, image_url, item_type_id, category_id, location_id, status_id, user_id, lost_found_date)
                VALUES
                (@title, @description, @image_url, @item_type_id, @category_id, @location_id, @status_id, @user_id, @lost_found_date)
            `);

        res.status(201).json({ message: "Predmet uspješno dodat." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllItems = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                items.id,
                items.title,
                items.description,
                items.image_url,
                items.user_id,
                items.lost_found_date,
                items.created_at,
                item_types.name AS item_type,
                categories.name AS category,
                locations.name AS location,
                item_statuses.name AS status,
                users.first_name,
                users.last_name
            FROM items
            JOIN item_types ON items.item_type_id = item_types.id
            JOIN categories ON items.category_id = categories.id
            JOIN locations ON items.location_id = locations.id
            JOIN item_statuses ON items.status_id = item_statuses.id
            JOIN users ON items.user_id = users.id
            ORDER BY items.created_at DESC
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("id", id)
            .query(`
                SELECT 
                    items.id,
                    items.title,
                    items.description,
                    items.image_url,
                    items.user_id,
                    items.lost_found_date,
                    items.created_at,
                    item_types.name AS item_type,
                    categories.name AS category,
                    locations.name AS location,
                    item_statuses.name AS status,
                    users.first_name,
                    users.last_name
                FROM items
                JOIN item_types ON items.item_type_id = item_types.id
                JOIN categories ON items.category_id = categories.id
                JOIN locations ON items.location_id = locations.id
                JOIN item_statuses ON items.status_id = item_statuses.id
                JOIN users ON items.user_id = users.id
                WHERE items.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Predmet nije pronađen." });
        }

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            item_type_id,
            category_id,
            location_id,
            status_id,
            lost_found_date
        } = req.body;

        const pool = await poolPromise;

        let image_url = req.body.image_url || null;

        if (req.file) {
            image_url = req.file.filename;
        }

        await pool.request()
            .input("id", id)
            .input("title", title)
            .input("description", description)
            .input("image_url", image_url)
            .input("item_type_id", item_type_id)
            .input("category_id", category_id)
            .input("location_id", location_id)
            .input("status_id", status_id)
            .input("lost_found_date", lost_found_date)
            .query(`
                UPDATE items
                SET
                    title = @title,
                    description = @description,
                    image_url = @image_url,
                    item_type_id = @item_type_id,
                    category_id = @category_id,
                    location_id = @location_id,
                    status_id = @status_id,
                    lost_found_date = @lost_found_date
                WHERE id = @id
            `);

        res.json({ message: "Predmet uspješno izmijenjen." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;

        await pool.request()
            .input("id", id)
            .query("DELETE FROM items WHERE id = @id");

        res.json({ message: "Predmet uspješno obrisan." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};