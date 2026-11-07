
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "db", "books.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      )
    `);

        const count = await db.get(
            "SELECT COUNT(*) AS count FROM book"
        );

        if (count.count === 0) {
            const books = [
                ["The Alchemist", "Paulo Coelho", 250, 208],
                ["Atomic Habits", "James Clear", 450, 320],
                ["Rich Dad Poor Dad", "Robert Kiyosaki", 300, 336],
                ["Wings of Fire", "A.P.J. Abdul Kalam", 200, 180],
                ["The Power of Habit", "Charles Duhigg", 400, 371],
                ["Think and Grow Rich", "Napoleon Hill", 350, 238],
                ["Deep Work", "Cal Newport", 500, 296],
                ["Ikigai", "Hector Garcia", 280, 194],
                ["The Psychology of Money", "Morgan Housel", 320, 256],
                ["Zero to One", "Peter Thiel", 390, 224]
            ];

            for (const book of books) {
                await db.run(
                    `INSERT INTO book (title, author, price, pages)
           VALUES (?, ?, ?, ?)`,
                    book
                );
            }
        }

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000/");
        });

    } catch (error) {
        console.log("Database Error:", error.message);
    }
};

app.get("/books/", async (request, response) => {
    try {
        const {
            search_q = "",
            order_by = "id",
            order = "ASC",
            limit = "10",
            offset = "0",
            min_price,
            max_price
        } = request.query;

        const allowedColumns = ["id", "title", "author", "price", "pages"];

        if (!allowedColumns.includes(order_by)) {
            return response.status(400).json({
                message: "Invalid order_by value"
            });
        }

        const sortOrder = order.toUpperCase();

        if (!["ASC", "DESC"].includes(sortOrder)) {
            return response.status(400).json({
                message: "Order must be ASC or DESC"
            });
        }

        const limitValue = Number(limit);
        const offsetValue = Number(offset);

        if (
            !Number.isInteger(limitValue) ||
            limitValue <= 0 ||
            !Number.isInteger(offsetValue) ||
            offsetValue < 0
        ) {
            return response.status(400).json({
                message: "Invalid limit or offset"
            });
        }

        const conditions = [];
        const parameters = [];

        if (search_q.trim() !== "") {
            conditions.push("title LIKE ?");
            parameters.push(`%${search_q}%`);
        }

        if (min_price !== undefined) {
            if (!Number.isFinite(Number(min_price))) {
                return response.status(400).json({
                    message: "min_price must be numeric"
                });
            }

            conditions.push("price >= ?");
            parameters.push(Number(min_price));
        }

        if (max_price !== undefined) {
            if (!Number.isFinite(Number(max_price))) {
                return response.status(400).json({
                    message: "max_price must be numeric"
                });
            }

            conditions.push("price <= ?");
            parameters.push(Number(max_price));
        }

        if (
            min_price !== undefined &&
            max_price !== undefined &&
            Number(min_price) > Number(max_price)
        ) {
            return response.status(400).json({
                message: "min_price cannot exceed max_price"
            });
        }

        let sqlQuery = "SELECT * FROM book";

        if (conditions.length > 0) {
            sqlQuery += " WHERE " + conditions.join(" AND ");
        }

        sqlQuery += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

        parameters.push(limitValue, offsetValue);

        const books = await db.all(sqlQuery, parameters);

        response.status(200).json(books);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

app.get("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const book = await db.get(
            "SELECT * FROM book WHERE id = ?",
            [bookId]
        );

        if (!book) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        response.status(200).json(book);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

app.post("/books/", async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return response.status(400).json({
                message: "Title is required"
            });
        }

        if (
            typeof author !== "string" ||
            author.trim() === ""
        ) {
            return response.status(400).json({
                message: "Author is required"
            });
        }

        if (
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).json({
                message: "Price must be numeric"
            });
        }

        if (
            pages !== undefined &&
            !Number.isFinite(Number(pages))
        ) {
            return response.status(400).json({
                message: "Pages must be numeric"
            });
        }

        const result = await db.run(
            `INSERT INTO book (title, author, price, pages)
       VALUES (?, ?, ?, ?)`,
            [
                title.trim(),
                author.trim(),
                Number(price),
                pages === undefined ? null : Number(pages)
            ]
        );

        response.status(201).json({
            message: "Book added successfully",
            bookId: result.lastID
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

app.put("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== "string" ||
            title.trim() === ""
        ) {
            return response.status(400).json({
                message: "Title is required"
            });
        }

        if (
            typeof author !== "string" ||
            author.trim() === ""
        ) {
            return response.status(400).json({
                message: "Author is required"
            });
        }

        if (
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).json({
                message: "Price must be numeric"
            });
        }

        if (
            pages !== undefined &&
            !Number.isFinite(Number(pages))
        ) {
            return response.status(400).json({
                message: "Pages must be numeric"
            });
        }

        const result = await db.run(
            `UPDATE book
       SET title = ?, author = ?, price = ?, pages = ?
       WHERE id = ?`,
            [
                title.trim(),
                author.trim(),
                Number(price),
                pages === undefined ? null : Number(pages),
                bookId
            ]
        );

        if (result.changes === 0) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        response.status(200).json({
            message: "Book updated successfully"
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

app.delete("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const result = await db.run(
            "DELETE FROM book WHERE id = ?",
            [bookId]
        );

        if (result.changes === 0) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        response.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

initializeDBAndServer();
