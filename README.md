# 🏎️ F1 Reaction Timer: Creation of a NodeJS API for F1 Style Reaction Timer with User Management

## 📝 Data Models

### 👥 Users
- email: String, required, unique. 📧
- password: String, required. 🔒
- role: Boolean, required (0 = admin, 1 = user). 👤

### ⏱ Timer
- user_id: ObjectId, foreign key to the user document. 🔗
- time: Number, required, in milliseconds (ms). ⏲️


## 🛣 Routes and HTTP Methods

### 🙍‍♂️🙍‍♀️ User Management
- Register: POST /register 📝
- Login: POST /login 🔑

### ⏱ Reaction Time Management
- Submit a reaction time: POST /submit-reaction-time 🏎️ (Protected route, requires token in the Authorization header)
- Retrieve reaction times for a user: GET /get-reaction-times 🔍 (Protected route, requires token in the Authorization header)

## 🚀 Installation and Setup with Docker
1. Prerequisites
Ensure you have Docker and Docker Compose installed on your machine.
2. Clone the Repository
```bash
    git clone https://github.com/SarahOtmane/API_Timer.git
    cd API_Timer
```
3. Create a .env File
Create a .env file in the root directory of your project and populate it with the following variables:
```bash 
    DB_NAME=name_of_your_db
    DB_NAME_TEST=name_of_you_db_of_test
    DB_USER=your_user
    DB_PASSWORD=your_password
    DB_HOST=db
    DB_PORT=27017
    JWT_KEY= your_secret_key
```
4. Build and Run the Application
```bash
    docker-compose up --build
```

5. Access the Application
- The API will be available at http://localhost:3000.
- MongoDB can be accessed at mongodb://localhost:27017.
- Mongo-Express to see your database : http://localhost:8081. The user and password are both: admin 