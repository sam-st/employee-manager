DROP DATABASE IF EXISTS employee_management;
CREATE DATABASE employee_management;

USE employee_management;

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    salary DECIMAL(10, 2) NOT NULL,
    department_name VARCHAR(255),
    FOREIGN KEY (department_name) REFERENCES departments(name)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    role_name VARCHAR(255),
    manager_name VARCHAR(255),
    FOREIGN KEY (role_name) REFERENCES roles(title)
);