const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'MYSQL98$!tree',
    database: 'employee_management'
});


const queries = {
    viewAllDepartments: (callback) => {
        db.query('SELECT * FROM departments', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    viewAllRoles: (callback) => {
        db.query('SELECT * FROM roles', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    viewAllEmployees: (callback) => {
        db.query('SELECT * FROM employees', (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    addDepartment: (departmentName, callback) => {
        db.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err, results) => {
            if (err) throw err;
            callback(results);
        });
    },

    addRole: (roleDetails, callback) => {
        db.query('INSERT INTO roles (title, salary, department_name) VALUES (?, ?, ?)', 
        [roleDetails.title, roleDetails.salary, roleDetails.department_name], 
        (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
                return;
            }
            callback(results);
        });
    },

    addEmployee: (employeeDetails, callback) => {
        db.query('INSERT INTO employees SET ?', employeeDetails, (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
                return;
            }
            callback(results);
        });
    },

    updateEmployeeRole: (employeeId, newRoleId, callback) => {
        db.query('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId, employeeId], (err, results) => {
            if (err) {
                console.error(err);
                callback(null);
                return;
            }
            callback(results);
        });
    }
};

module.exports = queries;