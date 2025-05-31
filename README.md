# IdeaUsher Node.js REST API

A RESTful API built with Node.js, Express, and MongoDB for managing Posts and Tags, with support for base64 image uploads. Views are rendered using EJS.

## Features
- CRUD for Posts and Tags
- Attach multiple tags to a post
- Upload images as base64 strings
- Filter, sort, and paginate posts
- Search posts by keyword (title/description) or tag
- Strict query parameter validation
- EJS-based views
- Ready-to-import Postman collection for API testing

## Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local or cloud)

## Setup
1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```env
     MONGODB_URI=mongodb://localhost:27017/ideausher_db
     PORT=3000
     ```
   - Update the URI if using a remote MongoDB instance.
4. **Start the server**
   ```bash
   npm start
   ```
   The server will run on [http://localhost:3000](http://localhost:3000) by default.

## API Endpoints

### Tags
- `POST /tags` — Create a new tag
  - Body: `{ "name": "news" }`
- `GET /tags` — List all tags

### Posts
- `POST /posts` — Create a new post
  - Body:
    ```json
    {
      "title": "Sample Post",
      "desc": "This is a sample post.",
      "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
      "tags": ["news", "tech"]
    }
    ```
- `GET /posts` — List posts with options:
  - `sort` (e.g. `-createdAt`)
  - `page` (default: 1)
  - `limit` (default: 10)
  - `keyword` (searches title/desc)
  - `tag` (filter by tag name)
  - Any extra query params will return 400 BAD_REQUEST

## Views
- EJS templates in `/views` for error and index pages.

## API Documentation & Testing
- Import `IdeaUsher-API.postman_collection.json` into Postman for ready-to-use API requests and examples.

## License
MIT
