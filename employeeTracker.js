const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: process.env.DB_PASS,
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    cmsSearch();
});

const cmsSearch = () => {
    const viewAllEmployees = 'View All Employees';

    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'what would you like to do?',
            choices: [
                viewAllEmployees,
                'View ALl Employees By Department',
                'View ALl Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Managers',
                'Add Manager',
                'Remove Manager',
                'View All Departments',
                'Add Department',
                'Remove Department',
                'View All Budgets of Each Department',
                'Exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case viewAllEmployees:
                    viewEmployees();
                    break;

                case 'View ALl Employees By Department':
                    viewEmployeesByDepartment();
                    break;

                case 'View ALl Employees By Manager':
                    viewEmployeesByManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Remove Role':
                    removeRole();
                    break;

                case 'View All Managers':
                    viewManagers();
                    break;

                case 'Add Manager':
                    addManager();
                    break;

                case 'Remove Manager':
                    removeManager();
                    break;

                case 'View All Departments':
                    viewDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Remove Department':
                    removeDepartment();
                    break;

                case 'View All Budgets of Each Department':
                    viewBudgets();
                    break;

                case 'Exit':
                    connection.end();
                    return;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                break;
            }

            return cmsSearch();
        });
};

const viewEmployees = () => {
    // https://www.npmjs.com/package/console.table

}

const viewEmployeesByDepartment = () => {


}

const viewEmployeesByManager = () => {


}

const addEmployee = () => {
    inquirer
        .prompt([{
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?",

            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: [],
            },
            {
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: []
            }
        ]);

}

const removeEmployee = () => {
    inquirer
        .prompt({
            name: 'remove',
            type: 'list',
            message: 'Which employee do you want to remove?',
            choices: []
        })

}

const updateEmployeeRole = () => {

}

const updateEmployeeManager = () => {
    inquirer
        .prompt([{
            name: 'update',
            type: 'list',
            message: "Which employee's manager do you want to update?",
            choices: []
        },
            {
                name: 'setManager',
                type: 'list',
                message: 'Which employee do you want to set as manager for the selected employee?',
                choices: []

            }

            ])

}

const viewRoles = () => {

}

const addRole = () => {
    inquirer
        .prompt([{
            name: 'roleType',
            type: 'input',
            message: 'What is the new department you would like to add?'
        },
            {
                name: 'salary',
                type: 'number'
            }
        ])

}

const removeRole = () => {
    inquirer
        .prompt({
            name: 'remove',
            type: 'list',
            message: 'Which role do you want to remove?',
            choices: []
        })

}

const viewManagers = () => {

}

const addManager = () => {
    inquirer
        .prompt([{
            name: 'firstName',
            type: 'input',
            message: "What is the manager's first name?",

        },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the manager's last name?",
            },
            {
                name: 'role',
                type: 'list',
                message: "What department will the manager be in charge of?",
                choices: [],
            }
        ]);

}

const removeManager = () => {
    inquirer
        .prompt({
            name: 'remove',
            type: 'list',
            message: 'Which manager do you want to remove?',
            choices: []
        })

}

const viewDepartments = () => {

}

const addDepartment = () => {

}

const removeDepartment = () => {
    inquirer
        .prompt({
            name: 'remove',
            type: 'list',
            message: 'Which department do you want to remove?',
            choices: []
        })

}

const viewBudgets = () => {

}



