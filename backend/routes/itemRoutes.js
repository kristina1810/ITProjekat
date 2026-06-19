const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} = require("../controllers/itemController");

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    createItem
);

router.get("/", getAllItems);

router.get("/:id", getItemById);

router.put(
    "/:id",
    authMiddleware,
    upload.single("image"),
    updateItem
);

router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;