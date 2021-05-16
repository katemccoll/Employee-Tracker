DROP DATABASE IF EXISTS employee_trackerDB;
CREATE database employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,4) NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

INSERT INTO departments(name) VALUES("Web");
INSERT INTO departments(name) VALUES("Product");

INSERT INTO roles(title, salary, department_id) VALUES("Senior Web Developer", 100000, 1);
INSERT INTO roles(title, salary, department_id) VALUES("Web Developer", 80000, 1);
INSERT INTO roles(title, salary, department_id) VALUES("Firmware Developer", 200000, 2);

INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES("Senior", "Boss", 1, NULL);
INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES("Kate", "McColl", 2, 1);