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
    return connection.queryAsync(`SELECT * FROM departments ORDER BY id ASC`).then((res) => {
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
        res.forEach((row) => {
            let managerName = row.first_name + " " + row.last_name;
            row.fullName = managerName;
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
    return connection.queryAsync('SELECT id, title FROM roles ORDER BY title').then((roles) => {
        const listOfRoles = [];
        roles.forEach((role) => {
            listOfRoles.push(role.title);
        });
        const managersQuery =
            `SELECT DISTINCT managers.id, managers.first_name, managers.last_name from employees 
         LEFT JOIN employees AS managers ON (employees.manager_id = managers.id)
         WHERE managers.id IS NOT NULL;`;
        return connection.queryAsync(managersQuery).then((managers) => {
            const managersList = [];
            managers.forEach((manager) => {
                let managerName = manager.first_name + " " + manager.last_name;
                manager.fullName = managerName;
                managersList.push(managerName);
            });
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
                        choices: listOfRoles,
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: "Who is the employee's manager?",
                        choices: managersList,
                    }
                ]).then((answer) => {
                    const roleData = roles.find((x) => x.title === answer.role);
                    const managerData = managers.find((x) => x.fullName === answer.manager);
                    return connection.queryAsync(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [
                        answer.firstName, answer.lastName, roleData.id, managerData.id
                    ]);
                });
        });
    });


}


const removeEmployee = () => {
    return connection.queryAsync('SELECT id, first_name, last_name FROM employees').then((employees) => {
        const listOfEmployees = [];
        employees.forEach((employee) => {
            let employeeFullName = employee.first_name + " " + employee.last_name;
            employee.fullName = employeeFullName;
            listOfEmployees.push(employee.fullName);
        });
        return inquirer
            .prompt({
                name: 'employee',
                type: 'list',
                message: 'Which employee do you want to remove?',
                choices: listOfEmployees,
            }).then((answer) => {
                const employeeData = employees.find((x) => x.fullName === answer.employee);
                const employeeID = employeeData.id
                return connection.queryAsync(`DELETE FROM employees WHERE ?`, {
                    id: employeeID
                });
            });
    });
}

const updateEmployeeRole = () => {
    return connection.queryAsync(`SELECT first_name, last_name FROM employees ORDER BY name`).then((res) => {
        let employeeList = [];
        res.forEach((employee) => {
            let employeeName = employee.first_name + " " + employee.last_name;
            employee.fullName = employeeName;
            employeeList.push(employeeName);
        });
        return inquirer
            .prompt({
                name: 'employee',
                type: 'list',
                message: "Which employee's role would you like to update?",
                choices: employeeList,
            }).then((amswers) => {
                return connection.queryAsync(`SELECT title FROM roles ORDER BY title`).then((res) => {
                    let roleList = [];
                    res.forEach((role) => {
                        roleList.push(role.title)
                    });
                    // return inquirer
                    //     .prompt({
                    //         name: 'update',
                    //         type: 'list',
                    //         message: 'Which role do you choose?',
                    //         choices: rolelist,
                    //     }).then
                    //
                    // })
            })

        })


    })
}

const updateEmployeeManager = () => {
    let displayList = [];


    return inquirer
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
            ]);
}

const viewRoles = () => {
    return connection.queryAsync('SELECT * FROM roles').then((res) => {
        console.table(res)
    });
}

const addRole = () => {
    return connection.queryAsync(`SELECT name, id FROM departments ORDER BY name ASC`).then((departments) => {
        const listOfDepartments = [];
        departments.forEach((department) => {
            listOfDepartments.push(department.name);
        });
        return inquirer
                .prompt([{
                    name: 'title',
                    type: 'input',
                    message: 'What is the new role you would like to add?'
                },
                {
                    name: 'salary',
                    type: 'number',
                    message: 'Salary number?'
                },
                {
                    name: 'department',
                    type: 'list',
                    message: 'What department is the new role to be apart of?',
                    choices: listOfDepartments,
                }
            ]).then((answer) => {
                const departmentData = departments.find((x) => x.name === answer.department);
                return connection.queryAsync(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [
                    answer.title, answer.salary, departmentData.id
                ]);
            });
        });
}

const removeRole = () => {
    return connection.queryAsync('SELECT title FROM roles ORDER BY title').then((res) => {
        const listOfRoles = [];
        res.forEach((role) => {
            listOfRoles.push(role.title);
        });
        return inquirer
            .prompt({
                name: 'remove',
                type: 'list',
                message: 'Which role do you want to remove?',
                choices: listOfRoles,
            }).then((answer) => {
                return connection.queryAsync(`DELETE FROM roles WHERE ?`, {
                    title: answer.remove,
                });
            });
    });
}

const viewManagers = () => {

}

const addManager = () => {

    return inquirer
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
        ]).then((input) => {
        return connection.queryAsync(`INSERT INTO employees (name) VALUES (?)`, input.name);
    });

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



