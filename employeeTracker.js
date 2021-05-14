const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    cmsSearch();
});

const cmsSearch = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'what would you like to do?',
            choices: [
                'Add departments, roles, employees',
                'View departments, roles, employees',
                'Update employee roles',
                'Delete departments, roles, and employees',
                'View the total utilized budget of a department',
                'Exit'
            ]
        });
};