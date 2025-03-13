# Data Catalog API

## Overview
This project is a RESTful API for managing Events, Properties, and Tracking Plans.

## Features
- CRUD operations for Events, Properties, and Tracking Plans.
- Validation for all API requests.
- Containerized using Docker.

## Setup
1. Clone the repository.
2. Set up environment variables (see `.env`).
3. Run the application: `docker-compose up --build`.

## API Documentation
An overview of endpoints is available in [Design Decisions Documentation](./DESIGN.md)
A swagger Documentation would be a future improvement.

## Testing
- Start the docker environment `docker-compose up --build`
- Enter the api container `docker exec -it data_catalog_api bash`
- Run unit tests: `npm test`.
    (Some tests fail and I did not have the time to locate the issues and fix them)

## Design Decisions
See [Design Decisions Documentation](./DESIGN.md)

## AI assistance
Deep seek was used during the implementation of this project in various ways. It was consulted for design decisions, it was used to generate the docker, prisma and typescript configurations. It was also used for advice on overcoming errors and contributed codeblocks as part of that procedure.
