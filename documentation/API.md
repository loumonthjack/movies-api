# Movies API Documentation

## Base URL
The API is served at `http://localhost:3000` by default.

## Endpoints

### Health Check
```http
GET /heartbeat
```
Returns the health status of the API.

#### Response
```json
{
  "status": "ok"
}
```

### Movies

#### Get All Movies
```http
GET /v1/movies
```
Retrieves a paginated list of all movies.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response Format:**
```json
{
  "data": [
    {
      "imdbId": "string",
      "title": "string",
      "genres": [{
        "id": "string",
        "name": "string"
      }],
      "releaseDate": "string",
      "budget": "string"
    }
  ],
  "page": number,
  "total_pages": number,
  "total_items": number
}
```

#### Get Movie Details
```http
GET /v1/movies/{imdbId}
```
Retrieves detailed information about a specific movie including its ratings.

**Parameters:**
- `imdbId`: IMDb ID of the movie 

**Response Format:**
```json
{
  "imdbId": "string",
  "movieId": "string",
  "overview": "string",
  "title": "string",
  "genres": ["string"],
  "releaseDate": "string",
  "budget": "string",
  "productionCompanies": ["string"],
  "revenue": "string",
  "language": "string",
  "runtime": "number",
  "status": "string",
  "ratings": [
    {
      "source": "string",
      "value": "string"
    }
  ]
}
```

#### Get Movies by Year
```http
GET /v1/movies/year/{year}
```
Retrieves a paginated list of movies released in a specific year.

**Parameters:**
- `year`: Four-digit year (e.g., 2024)

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `sort` (optional): Sort order for release date
  - `desc`: Latest to oldest
  - `asc` (default): Oldest to latest

**Response Format:**
```json
{
  "data": [
    {
      "imdbId": "string",
      "title": "string",
      "genres": ["string"],
      "releaseDate": "string",
      "budget": "string"
    }
  ],
  "page": number,
  "total_pages": number,
  "total_items": number
}
```

#### Get Movies by Genre
```http
GET /v1/movies/genre/{genre}
```
Retrieves a paginated list of movies of a specific genre.

**Parameters:**
- `genre`: Movie genre (URL encoded)

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)

**Response Format:**
```json
{
  "data": [
    {
      "imdbId": "string",
      "title": "string",
      "genres": ["string"],
      "releaseDate": "string",
      "budget": "string"
    }
  ],
  "page": number,
  "total_pages": number,
  "total_items": number
}
```

## General Error Responses

All endpoints may return the following error responses:

### 404 Not Found
```json
{
  "error": "Not Found"
}
```

### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Pagination
Most endpoints that return lists support pagination with the following:
- Default page size: 50 items per page
- Page numbers start at 1
- Use the `page` query parameter to request specific pages
