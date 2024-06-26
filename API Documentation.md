## API Documentation

-  **Endpoint:** `/createRoom`
  - **Method:** POST
  - **Description:** Create a new room entry.
  - **Headers:** Authorization token required.
  - **Request Body:**
    ```json
    {
      "roomCode": "string",
      "buildingName": "string",
      "floorNumber": "string"
    }
    ```
  - **Response:**
    - Status Code: 201
    - Body:
      ```json
      {
        "roomCode": "string",
        "buildingName": "string",
        "floorNumber": "string",
        "creator": "string",
        "modifier": "string",
        "createTime": "date",
        "modifyTime": "date"
      }
      ```

-  **Endpoint:** `/updateRoom`
  - **Method:** POST
  - **Description:** Update an existing room entry.
  - **Headers:** Authorization token required.
  - **Request Body:**
    ```json
    {
      "roomCode": "string",
      "buildingName": "string",
      "floorNumber": "string"
    }
    ```
  - **Response:**
    - Status Code: 200
    - Body:
      ```json
      {
        "roomCode": "string",
        "buildingName": "string",
        "floorNumber": "string",
        "modifier": "string",
        "modifyTime": "date"
      }
      ```

-  **Endpoint:** `/getRooms`
  - **Method:** POST
  - **Description:** Get a list of rooms based on search criteria.
  - **Headers:** Authorization token required.
  - **Request Body:**
    ```json
    {
      "page": "number",
      "pageSize": "number",
      "roomCode": "string"
    }
    ```
  - **Response:**
    - Status Code: 200
    - Body:
      ```json
      {
        "rooms": [
          {
            "roomCode": "string",
            "buildingName": "string",
            "floorNumber": "string",
            "creator": "string",
            "modifier": "string",
            "createTime": "date",
            "modifyTime": "date"
          }
        ],
        "totalPages": "number",
        "currentPage": "number"
      }
      ```
