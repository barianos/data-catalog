# Design Document

## Overview
The **Data Catalog API** is a RESTful service designed to manage **Events**, **Properties**, and **Tracking Plans**. It provides CRUD operations for these entities and ensures data integrity through validation and proper database modeling.

**Architecture**
----------------

### **1\. High-Level Architecture**

The application follows a **layered architecture** with the following components:

1.  **API Layer**: Handles incoming HTTP requests and responses.
    
2.  **Service Layer**: Implements business logic and interacts with the data access layer.
    
3.  **Data Access Layer**: Manages database operations using **Prisma**.
    
4.  **Database**: PostgreSQL database for persistent storage.
    

### **2\. Technology Stack**

*   **Backend**: Node.js with Express.js
    
*   **Database**: PostgreSQL
    
*   **ORM**: Prisma
    
*   **Validation**: class-validator and class-transformer
    
*   **Containerization**: Docker
    
*   **Logging**:  (to be implemented)
    
*   **Testing**: (to be implemented)
    

**Database Design**
-------------------

### **1\. Entities and Relationships**

The database schema consists of the following entities and their relationships:

#### **Entities**

1.  **TrackingPlan**
    
    *   Represents a tracking plan that groups multiple events.
        
    *   Fields: id, name, description, createdAt, updatedAt.
        
2.  **Event**
    
    *   Represents an event that can be part of multiple tracking plans.
        
    *   Fields: id, name, type, description, createdAt, updatedAt.
        
3.  **Property**
    
    *   Represents a property associated with an event.
        
    *   Fields: id, name, type, description, createdAt, updatedAt.
        
4.  **TrackingPlanEvent**
    
    *   Represents the many-to-many relationship between TrackingPlan and Event.
        
    *   Fields: id, trackingPlanId, eventId, additionalProperties.
        
5.  **TrackingPlanEventProperty**
    
    *   Represents the many-to-many relationship between TrackingPlanEvent and Property.
        
    *   Fields: id, trackingPlanEventId, propertyId, required.
        
6.  **EventProperty**
    
    *   Represents the many-to-many relationship between Event and Property.
        
    *   Fields: id, eventId, propertyId, required.
        

### **2\. Schema Diagram**

plaintextCopy

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   TrackingPlan  ├── id  ├── name  ├── description  ├── createdAt  ├── updatedAt  └── events (one-to-many with TrackingPlanEvent)  TrackingPlanEvent  ├── id  ├── trackingPlanId  ├── eventId  ├── additionalProperties  ├── trackingPlan (many-to-one with TrackingPlan)  ├── event (many-to-one with Event)  └── properties (one-to-many with TrackingPlanEventProperty)  TrackingPlanEventProperty  ├── id  ├── trackingPlanEventId  ├── propertyId  ├── required  ├── trackingPlanEvent (many-to-one with TrackingPlanEvent)  └── property (many-to-one with Property)  Event  ├── id  ├── name  ├── type  ├── description  ├── createdAt  ├── updatedAt  └── properties (one-to-many with EventProperty)  EventProperty  ├── id  ├── eventId  ├── propertyId  ├── required  ├── event (many-to-one with Event)  └── property (many-to-one with Property)  Property  ├── id  ├── name  ├── type  ├── description  ├── createdAt  ├── updatedAt  └── events (one-to-many with EventProperty)   `

**API Design**
--------------

### **1\. Endpoints**

The API provides the following RESTful endpoints:

#### **Tracking Plans**

*   POST /tracking-plans: Create a new tracking plan.
    
*   GET /tracking-plans: Fetch all tracking plans.
    
*   GET /tracking-plans/:id: Fetch a specific tracking plan by ID.
    
*   PUT /tracking-plans/:id: Update a tracking plan by ID.
    
*   DELETE /tracking-plans/:id: Delete a tracking plan by ID.
    

#### **Events**

*   POST /events: Create a new event.
    
*   GET /events: Fetch all events.
    
*   GET /events/:id: Fetch a specific event by ID.
    
*   PUT /events/:id: Update an event by ID.
    
*   DELETE /events/:id: Delete an event by ID.
    

#### **Properties**

*   POST /properties: Create a new property.
    
*   GET /properties: Fetch all properties.
    
*   GET /properties/:id: Fetch a specific property by ID.
    
*   PUT /properties/:id: Update a property by ID.
    
*   DELETE /properties/:id: Delete a property by ID.
    

### **2\. Validation**

*   All API requests are validated using **class-validator** and **class-transformer**.
    
*   Validation rules are defined in DTOs (Data Transfer Objects) for each entity.
    
*   Example: CreateTrackingPlanDto validates the name, description, and events fields.
    

**Trade-Offs and Decisions**
----------------------------

### **1\. Database Schema**

*   **Decision**: Use a relational database (PostgreSQL) with many-to-many relationships.
    
*   **Trade-Off**: While NoSQL databases like MongoDB could simplify nested data structures, a relational database was chosen for better data integrity and query flexibility.
    

### **2\. ORM**

*   **Decision**: Use **Prisma** as the ORM.
    
*   **Trade-Off**: Prisma provides a type-safe API and simplifies database operations, but it adds some overhead compared to raw SQL queries.
    

### **3\. Validation**

*   **Decision**: Use **class-validator** and **class-transformer** for request validation.
    
*   **Trade-Off**: These libraries provide robust validation but require additional setup and can increase bundle size.
    

### **4\. Containerization**

*   **Decision**: Use **Docker** for containerization.
    
*   **Trade-Off**: Docker simplifies deployment and ensures consistency across environments but adds complexity to the development setup.
    

**Future Improvements**
-----------------------

### **1\. Logging**

*   Implement logging to track API requests, errors, and important operations.
    

### **2\. Testing**

*   Add unit tests for controllers, services, and validation logic.
    
*   Add integration tests for API endpoints.
    

### **3\. Pagination**

*   Implement pagination for endpoints that return large datasets (e.g., GET /tracking-plans).
    

### **4\. Authentication and Authorization**

*   Add authentication (e.g., JWT) and role-based access control (RBAC) to secure the API.
    

### **5\. API Documentation**

*   Use **Swagger** or **Postman** to generate API documentation.
    

**Conclusion**
--------------

The **Data Catalog API** is designed to be scalable, maintainable, and easy to use. By following best practices for API design, database modeling, and validation, the application provides a robust foundation for managing Events, Properties, and Tracking Plans. Future improvements, such as logging, testing, and pagination, will further enhance its functionality and reliability.