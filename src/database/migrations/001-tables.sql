--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS Employee (
  id INTEGER PRIMARY KEY,
  name TEXT,
  surname TEXT,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES Department(id)
);

CREATE TABLE IF NOT EXISTS Department (
  id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS Salary (
  id INTEGER PRIMARY KEY,
  amount REAL,
  date TEXT,
  employee_id INTEGER,
  FOREIGN KEY (employee_id) REFERENCES Employee(id)
);

CREATE TABLE IF NOT EXISTS Donation (
  id INTEGER PRIMARY KEY,
  date TEXT,
  amount REAL,
  usd_equivalent REAL DEFAULT NULL,
  employee_id INTEGER,
  FOREIGN KEY (employee_id) REFERENCES Employee(id)
);

CREATE TABLE Rate (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  sign TEXT,
  value REAL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE Employee;
DROP TABLE Department;
DROP TABLE Salary;
DROP TABLE Donation;
DROP TABLE Rate;