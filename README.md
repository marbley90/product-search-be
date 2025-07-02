## Setup Instructions

### Requirements

- Docker & Docker Compose
- No need to install Node.js locally

### 1. Clone the Project

```bash
git clone https://github.com:marbley90/product-search-be.git
cd product-search-be
```

### 2. Start the entire stack
This will launch:

- Elasticsearch at http://localhost:9200

- Kibana at http://localhost:5601

- The NestJS API at http://localhost:3001

```bash
docker-compose up --build
```

### 3. Access the Services
| Service           | URL                                                    |
| ----------------- | ------------------------------------------------------ |
| **NestJS API**    | [http://localhost:3001](http://localhost:3001)         |
| **Swagger UI**    | [http://localhost:3001/api](http://localhost:3001/api) |
| **Kibana (GUI)**  | [http://localhost:5601](http://localhost:5601)         |
| **Elasticsearch** | [http://localhost:9200](http://localhost:9200)         |


### 4. Data Initialization
On startup, the application automatically generates and indexes 1,000+ fake products using Faker.js and stores them in Elasticsearch. Thus, there is no need for manual seeding.


### 5. Unit Tests
This project includes some **basic Jest unit tests** for demonstration purposes (e.g., search and indexing logic with mocks for Elasticsearch and cache).

To run the tests:

```bash
npm run test
```

This runs the Jest test suite defined under:
```
"scripts": {
  "test": "jest"
}
```

These tests cover:

- Search service behavior with and without cache hits

- Elasticsearch query mocking

- Error handling logic

- Product indexing success and failure cases



---

##  Architecture & Approach

```markdown
### Technologies Used

- NestJS: Backend framework with modular structure
- Elasticsearch 7.10.2: Search engine for indexing and querying product data
- Kibana: UI tool to inspect Elasticsearch documents and logs
- Swagger (OpenAPI): API documentation with live testing
- Faker.js: For generating synthetic product data
- lru-cache: In-memory caching of top search queries
- Docker: Manages the entire stack locally

---

### Key Features

- `POST /products`: Index new product data
- `GET /search?q=...`: Full-text search over product titles and descriptions
- Typo-tolerant (`fuzziness: AUTO`) search behavior
- Results are ranked by relevance score
- Top 10 most frequent queries are cached using an LRU strategy
- Response time and query frequency are tracked
- `GET /search/analytics`: Exposes metrics
- Auto-generated product data on boot via `SeederService`

## Assumptions & Trade-offs

### Assumptions

- Products contain only `id`, `title`, and `description`
- Auto-seeding is sufficient for testing/search evaluation
- Elasticsearch is local and runs with default memory settings
- 10-entry cache is adequate for the expected search volume

### Trade-offs

- Cache and analytics are stored in-memory (lost on restart)
- No pagination or sorting parameters implemented
- Greek-language or transliterated queries are not matched to English
- No production-grade logging or security middleware is included
- Not designed for multi-user scaling without external cache (e.g., Redis)
- Analytics tracking (e.g., query frequency, response time) is not implemented (This could be added by integrating a lightweight service or Prometheus-compatible metrics layer.)
```
