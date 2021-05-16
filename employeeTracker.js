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
                    return viewEmployees();

                case 'View ALl Employees By Department':
                    return viewEmployeesByDepartment();

                case 'View ALl Employees By Manager':
                    return viewEmployeesByManager();

                case 'Add Employee':
                    return addEmployee();

                case 'Remove Employee':
                    return removeEmployee();

                case 'Update Employee Role':
                    return updateEmployeeRole();

                case 'Update Employee Manager':
                    return updateEmployeeManager();

                case 'View All Roles':
                    return viewRoles();

                case 'Add Role':
                    return addRole();

                case 'Remove Role':
                    return removeRole();

                case 'View All Managers':
                    return viewManagers();

                case 'Add Manager':
                    return addManager();

                case 'Remove Manager':
                    return removeManager();

                case 'View All Departments':
                    return viewDepartments();

                case 'Add Department':
                    return addDepartment();

                case 'Remove Department':
                    return removeDepartment();

                case 'View All Budgets of Each Department':
                    return viewBudgets();

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

const viewEmployees = (options) => {

    let where = '';
    let args = [];
    if (options !== undefined) {
        if (options.departmentId !== undefined) {
            where = `WHERE roles.department_id = ?`;
            args.push(options.departmentId);
        } else if (options.managerId !== undefined) {
            where = `WHERE employees.manager_id = ?`;
            args.push(options.managerId);
        }
    }

    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, 
                        departments.name AS department_name, manager.first_name AS manager_first_name,
                        manager.last_name AS manager_last_name
        FROM employees
        INNER JOIN roles ON (employees.role_id = roles.id)
        INNER JOIN departments ON (departments.id = roles.department_id)
        LEFT JOIN employees AS manager ON (manager.id = employees.manager_id)
        ${where}
    `;

    return connection.queryAsync(query, args).then((res) => {
        let displayList = [];
        res.forEach((row) => {
            let managerName = null;
            if (row.manager_first_name !== null) {
                managerName = row.manager_first_name + " " + row.manager_last_name;
            }

            displayList.push({
               id: row.id,
               first_name: row.first_name,
               last_name: row.last_name,
               title: row.title,
               department: row.department_name,
               salary: row.salary,
               manager: managerName
           }) ;
        });
        console.table(displayList);
    });
}

const viewEmployeesByDepartment = () => {
    return connection.queryAsync(`SELECT * FROM departments`).then((res) => {
        return inquirer
            .prompt({
                name: 'department',
                type: 'list',
                message: 'Which department?',
                choices: res,
            }).then((answers) => {
                const department = res.find((x) => x.name === answers.department);
                return viewEmployees({departmentId: department.id})
            });

        console.table(res);
    });
}

const viewEmployeesByManager = () => {

    const managersQuery =
        `SELECT DISTINCT managers.id, managers.first_name, managers.last_name from employees 
         LEFT JOIN employees AS managers ON (employees.manager_id = managers.id)
         WHERE managers.id IS NOT NULL;`;

    return connection.queryAsync(managersQuery).then((res) => {

        let managerList = [];
        res.forEach((name) => {
            let managerName = name.first_name + " " + name.last_name;
            name.fullName = managerName;
            managerList.push(managerName);
        });

        return inquirer
            .prompt({
                name: 'manager',
                type: 'list',
                message: 'Which Manager?',
                choices: managerList,
            }).then((answers) => {
                const manager = res.find((x) => x.fullName === answers.manager);
                return viewEmployees({managerId: manager.id})
            });
    });

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
    return connection.queryAsync(`SELECT name FROM departments ORDER BY name`).then((res) => {
        let listOfDepartments = [];
        res.forEach((department) => {
            listOfDepartments.push(department.name);
        });
        return inquirer
            .prompt({
                name: 'remove',
                type: 'list',
                message: 'Which department do you want to remove?',
                choices: listOfDepartments,
            }).then((answers) => {
                return connection.queryAsync(`DELETE FROM departments WHERE ?`, {
                    name: answers.remove,
                });
            });
    });
}

const viewBudgets = () => {

}



