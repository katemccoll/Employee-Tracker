const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password:  process.env.DB_PASS,
    database: 'employee_trackerDB',
});

connection.queryAsync = util.promisify(connection.query);
connection.connectAsync = util.promisify(connection.connect);

connection.connectAsync().then(() => {
    return cmsSearch();
}).catch((err) => {
    console.error(err);
}).finally(() => {
    connection.end();
});


const cmsSearch = () => {

    let shouldExit = false;

    return inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'what would you like to do?',
            choices: [
                'View All Employees',
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
        }).then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    viewEmployees();
                    break;

                case 'View ALl Employees By Department':
                    viewEmployeesByDepartment();
                    break;

                case 'View ALl Employees By Manager':
                    viewEmployeesByManager();
                    break;

                case 'Add Employee':
                    return addEmployee();

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
                    return viewDepartments();

                case 'Add Department':
                    return addDepartment();

                case 'Remove Department':
                    removeDepartment();
                    break;

                case 'View All Budgets of Each Department':
                    viewBudgets();
                    break;

                case 'Exit':
                    shouldExit = true;
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        }).then(() => {
            if (!shouldExit) {
                return cmsSearch();
            }
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
    return inquirer
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
        ]).then((res) => {
            console.log(res);
        });

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

const queryRoles = () => {
    const query =
        'SELECT title FROM role ORDER BY id';
    connection.query(query, (err, res) => {
        if (err) throw err;

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
    return connection.queryAsync(`SELECT * FROM departments`).then((res) => {
        console.table(res);
    });

}

const addDepartment = () => {
    return inquirer
        .prompt({
            name: 'name',
            type: 'input',
            message: 'Department name',
        }).then((input) => {
            return connection.queryAsync(`INSERT INTO departments (name) VALUES (?)`, input.name);
        });

}

const removeDepartment = () => {
    inquirer
        .prompt({
            name: 'remove',
            type: 'list',
            message: 'Which department do you want to remove?',
            choices: []
        });

}

const viewBudgets = () => {

}



