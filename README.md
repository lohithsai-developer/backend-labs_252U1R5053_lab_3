
## LAB – 03: REST API, QUERY PARAMETERS, VALIDATION AND DEBUGGING

---

### STUDENT DETAILS

| Field | Details |
|---|---|
| **Name** | GUTHHIKONDA LOHITH SAI |
| **Registration Number** | 252U1R5053 |
| **Class & Section** | 106 – AI & DE-2A |
| **Lab Number** | 03 |

---

## 1. Overview

This lab focuses on developing a RESTful API using Node.js, Express.js and SQLite. It extends basic CRUD operations by implementing search, sorting, pagination, price filtering, input validation and appropriate HTTP status codes.

The application manages book records stored in an SQLite database and allows users to perform different operations through HTTP requests.

## 2. Objectives

- Develop RESTful API endpoints using Express.js.
- Implement search functionality using query parameters.
- Implement sorting in ascending and descending order.
- Add pagination using limit and offset.
- Filter books based on minimum and maximum prices.
- Validate incoming request data.
- Handle missing records and invalid requests.
- Use appropriate HTTP status codes.
- Test API endpoints using Postman.
- Understand and debug common backend errors.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| SQLite | Database |
| sqlite3 | SQLite database driver |
| sqlite | Promise-based database operations |
| Nodemon | Automatic server restarting |
| Postman | API testing |
| Git & GitHub | Version control and source code hosting |
| Render | Backend deployment platform |

## 4. Project Structure

```text
lab_3/
│
├── db/
│   └── books.db
│
├── screenshots/
│   ├── get-all-books.png
│   ├── search-books.png
│   ├── sort-books.png
│   ├── pagination.png
│   ├── price-filter.png
│   ├── get-single-book.png
│   ├── add-book.png
│   ├── update-book.png
│   ├── delete-book.png
│   ├── invalid-request.png
│   └── book-not-found.png
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 5. Database Structure

**Database:** `books.db`

**Table:** `book`

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key with auto increment |
| title | TEXT | Book title |
| author | TEXT | Book author |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

The application automatically creates the database table and inserts 10 sample book records when the table is empty.

## 6. Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/lohithsai-developer/backend-labs_252U1R5053_lab_3.git
```

### Step 2: Navigate to the Project Folder

```bash
cd backend-labs_252U1R5053_lab_3
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The local server runs at:

```text
http://localhost:3000/
```

## 7. API Endpoints

**Base URL:**

```text
http://localhost:3000
```

### 7.1 Get All Books

- **Method:** GET
- **Endpoint:** `/books/`
- **Description:** Retrieves all books from the database.
- **Expected Status:** 200 OK

### 7.2 Get a Book by ID

- **Method:** GET
- **Endpoint:** `/books/:bookId/`
- **Description:** Retrieves a specific book using its ID.
- **Expected Status:** 200 OK

### 7.3 Add a New Book

- **Method:** POST
- **Endpoint:** `/books/`
- **Description:** Adds a new book to the database.
- **Expected Status:** 201 Created

**Request Body:**

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "pages": 464
}
```

### 7.4 Update a Book

- **Method:** PUT
- **Endpoint:** `/books/:bookId/`
- **Description:** Updates the details of an existing book.
- **Expected Status:** 200 OK

**Request Body:**

```json
{
  "title": "The Alchemist Updated",
  "author": "Paulo Coelho",
  "price": 300,
  "pages": 220
}
```

### 7.5 Delete a Book

- **Method:** DELETE
- **Endpoint:** `/books/:bookId/`
- **Description:** Deletes a specific book using its ID.
- **Expected Status:** 200 OK

## 8. Query Parameters

The GET `/books/` endpoint supports the following query parameters.

| Parameter | Description | Default |
|---|---|---|
| `search_q` | Searches books by partial title | Empty |
| `order_by` | Sorts using a permitted column | `id` |
| `order` | Sorting direction: ASC or DESC | `ASC` |
| `limit` | Maximum number of records | `10` |
| `offset` | Number of records to skip | `0` |
| `min_price` | Minimum book price | Optional |
| `max_price` | Maximum book price | Optional |

### 8.1 Search Books

```text
GET /books/?search_q=Atomic
```

Searches for books whose titles contain the given text.

### 8.2 Sort Books

```text
GET /books/?order_by=price&order=DESC
```

Sorts books by price in descending order.

### 8.3 Pagination

```text
GET /books/?limit=5&offset=0
```

Returns a maximum of five records.

### 8.4 Price Filtering

```text
GET /books/?min_price=200&max_price=400
```

Returns books with prices between 200 and 400.

### 8.5 Combined Query

```text
GET /books/?search_q=The&order_by=price&order=ASC&limit=5&offset=0&min_price=200&max_price=500
```

Combines search, sorting, pagination and price filtering.

## 9. Input Validation and Error Handling

The API performs validation before inserting or updating book records.

- Title must be provided and cannot be empty.
- Author must be provided and cannot be empty.
- Price must be numeric.
- Pages must be numeric when provided.
- Invalid sorting columns are rejected.
- Sorting order must be ASC or DESC.
- Limit must be a positive integer.
- Offset must be a non-negative integer.
- Minimum price cannot exceed maximum price.
- A 404 response is returned when a requested book does not exist.

## 10. HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 OK | Request completed successfully |
| 201 Created | New book created successfully |
| 400 Bad Request | Invalid input or validation error |
| 404 Not Found | Requested book does not exist |
| 500 Internal Server Error | Server-side error |

## 11. Postman Testing

All API endpoints were tested using Postman.

The following test cases were performed:

1. Retrieving all books.
2. Searching books by title.
3. Sorting books by price.
4. Testing pagination.
5. Filtering books by price range.
6. Retrieving a single book.
7. Adding a new book.
8. Updating an existing book.
9. Deleting a book.
10. Testing invalid request validation.
11. Testing book-not-found error handling.

## 12. Postman Screenshots

The following screenshots demonstrate the API requests and their corresponding responses.

### 12.1 GET All Books

<img width="1920" height="1031" alt="get-all-books" src="https://github.com/user-attachments/assets/206d49b6-6170-423c-966e-2891eea95dd2" />


### 12.2 Search Books

<img width="1920" height="1030" alt="search-books" src="https://github.com/user-attachments/assets/a284df54-6aff-4b85-8deb-28a8c772f41d" />



### 12.3 Sort Books

<img width="1920" height="1041" alt="sort-books" src="https://github.com/user-attachments/assets/5a8da06f-3e5c-4209-b056-159d5958c10e" />


### 12.4 Pagination

<img width="1920" height="1013" alt="pagination" src="https://github.com/user-attachments/assets/a237bb3c-35cd-423e-9ea9-6bf529b734e1" />


### 12.5 Price Filtering

<img width="1920" height="1030" alt="price-filter" src="https://github.com/user-attachments/assets/7a65d58c-8be2-4bd0-b66a-a1a20e09a412" />


### 12.6 Get a Single Book

<img width="1920" height="1015" alt="get-single-book" src="https://github.com/user-attachments/assets/1a61223b-efab-4bb2-b996-a9c4e738b06a" />


### 12.7 Add a New Book

<img width="1920" height="1024" alt="add-book" src="https://github.com/user-attachments/assets/2a6e6963-5ea3-485b-8a62-5204521c03e8" />


### 12.8 Update a Book

<img width="1920" height="1032" alt="update-book" src="https://github.com/user-attachments/assets/eb07f706-38ba-423b-b694-808bf2de7861" />


### 12.9 Delete a Book

<img width="1920" height="1031" alt="delete-book" src="https://github.com/user-attachments/assets/7887fb40-8900-4935-a5ef-5fba39ba3135" />


### 12.10 Invalid Request Validation

<img width="1919" height="1017" alt="invalid-request" src="https://github.com/user-attachments/assets/c6e8ccea-cbe1-4231-9613-4031dfff2161" />


### 12.11 Book Not Found



## 13. Backend Deployment

The backend is configured for deployment using Render as a Node.js Web Service.

**Deployment Platform:** Render

**Live Backend URL:** https://backend-labs-252u1r5053-lab-3.onrender.com/

**API Endpoint After Deployment:**


The deployment uses:

- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: Node.js

The SQLite native-module compatibility issue is currently being resolved before publishing the live API URL.

## 14. Learning Outcomes

Through this lab, I learned how to build RESTful APIs using Express.js and work with SQLite databases. I gained practical experience in implementing query parameters, performing search and filtering operations, adding sorting and pagination, validating user input and handling errors using appropriate HTTP status codes.

I also improved my understanding of API testing using Postman, debugging common backend issues, managing code through Git and GitHub, and preparing a backend application for cloud deployment.

## 15. Conclusion

Successfully developed and tested a REST API for book management using Node.js, Express.js and SQLite. The application supports CRUD operations, search, sorting, pagination, price filtering, input validation and error handling. This lab provided practical experience in backend API development, database integration, testing and deployment preparation.

---

