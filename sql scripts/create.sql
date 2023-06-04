DROP DATABASE IF EXISTS my_db;

CREATE DATABASE my_db;

USE my_db;

CREATE TABLE
    users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(45) NOT NULL,
        firstname VARCHAR(45) NOT NULL,
        lastname VARCHAR(45) NOT NULL,
        country VARCHAR(45) NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(45) NOT NULL,
        profilePic VARCHAR(50)
    );

CREATE TABLE
    user_recipes (
        user_id INT,
        recipe_id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255),
        title VARCHAR(255),
        readyInMinutes INT,
        vegan TINYINT(1),
        vegetarian TINYINT(1),
        glutenFree TINYINT(1),
        aggregateLikes INT,
        instructions TEXT,
        servings INT,
        extendedIngredients TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    favorite_recipes (
        user_id INT,
        recipe_id INT,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    watched_recipes (
        watched_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        recipe_id INT,
        PRIMARY KEY (user_id, recipe_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

CREATE TABLE
    family_recipes (
        recipe_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        image VARCHAR(255),
        title VARCHAR(255),
        readyInMinutes INT,
        vegan TINYINT(1),
        vegetarian TINYINT(1),
        glutenFree TINYINT(1),
        aggregateLikes INT,
        instructions TEXT,
        servings INT,
        extendedIngredients TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
    );