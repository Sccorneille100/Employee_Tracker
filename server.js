const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL Username
        user: 'root',
        // TODO: Add MySQL Password
        password: 'Icecream*129',
        database: 'employees_db'
    },
);

async function mainMenu() {
    const options = [
        'View all Departments',
        'View all Roles',
        'View all Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update Employee Role'
    ]

    const results = await inquirer.prompt([{
        message: 'What would you like to do?',
        name: 'command',
        type: 'list',
        choices: options,
    }]);
    if (results.command == 'View all Departments') {
        await displayDepartments();
    } else if (results.command == 'View all Roles') {
        await displayRoles();

    } else if (results.command == 'View all Employees') {
        await displayEmployees();

    } else if (results.command == 'Add a Department') {
        await addDepartment();

    } else if (results.command == 'Add a Role') {
        await addRole();

    } else if (results.command == 'Add an Employee') {
        await addEmployee();

    } else if (results.command == 'Update Employee Role') {
        await updateEmployeeRole();
    } else {
        console.log('error');
    }

}


async function displayDepartments() {
    const [departmentData, departmentFields] = await db.promise().query("Select * FROM department")
    console.log(departmentData)
    mainMenu();
}


async function displayRoles() {
    const query = "select role.id, role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id"
    const [roleData, roleFields] = await db.promise().query(query)
    console.log(roleData);
    mainMenu();
}

async function displayEmployees() {

    const query = `
    SELECT employee.id, employee.firstname, employee.lastname, role.title AS role, role.salary, department.name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
  `;

    const [employeeData, employeeFields] = await db.promise().query(query);
    console.log(employeeData);
    mainMenu();
}



async function addDepartment() {
    const departmentInfo = await inquirer.prompt([
        {
            message: 'enter the department title',
            name: 'name',
            type: 'input',
        }
    ]);
    console.log(departmentInfo);

    const { name } = departmentInfo;
    const query = 'INSERT INTO department (name) VALUES (?)';
    const values = [name];

    try {
        await db.promise().query(query, values);
        console.log('new department added successfully');
    } catch (error) {
        console.error('Error inserting new department:', error);
    }

    mainMenu();
}

async function addRole() {
    const [departmentInfo, departmentFields] = await db.promise().query("SELECT * FROM department");
    console.log(departmentInfo)

    const departmentChoices = departmentInfo.map((department) => ({
        name: department.name,
        value: department.id
    }));

    const roleInfo = await inquirer.prompt([
        {
            message: 'enter the role title',
            name: 'title',
            type: 'input',
        },
        {
            message: 'enter the role salary',
            name: 'salary',
            type: 'input',
        },
        {
            message: "Pick the department",
            name: "department_id",
            type: 'list',
            choices: departmentChoices,
        },
    ]);
    console.log(roleInfo);

    const { title, salary, department_id } = roleInfo;

    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const values = [title, salary, department_id];

    try {
        await db.promise().query(query, values);
        console.log('New role added successfully!');
    } catch (error) {
        console.error('Error inserting new role:', error);
    }

    mainMenu();
}

async function addEmployee() {
    const [roleInfo, roleFields] = await db.promise().query("SELECT * FROM role");
    const [employeeInfo, employeeFields] = await db.promise().query("SELECT * FROM employee");

    const roleChoices = roleInfo.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const managerChoices = employeeInfo.map((employee) => ({
        name: `${employee.firstname} ${employee.lastname}`,
        value: employee.id,
    }));


    const employeeData = await inquirer.prompt([
        {
            message: 'enter employee first name',
            name: 'firstname',
            type: 'input',
        },
        {
            message: 'enter employee last name',
            name: 'lastname',
            type: 'input',
        },
        {
            message: 'enter employee role',
            name: 'role',
            type: 'list',
            choices: roleChoices
        },
        {
            message: 'enter employee\'s manager',
            name: 'manager',
            type: 'list',
            choices: managerChoices
        }
    ]);
    console.log(employeeData);

    const { firstname, lastname, role, manager } = employeeData;

    const query = 'INSERT INTO employee (firstname, lastname, role_id, manager_id) VALUES (?, ?, ?, ?)';
    const values = [firstname, lastname, role, manager];


    try {
        await db.promise().query(query, values);
        console.log('new employee added successfully');
    } catch (error) {
        console.error('Error inserting new employee:', error);
    }

    mainMenu();
}

async function updateEmployeeRole() {
    const [employeeInfo, employeeFields] = await db.promise().query("SELECT * FROM employee");
    const [roleInfo, roleFields] = await db.promise().query("SELECT * FROM role");

    const roleChoices = roleInfo.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const employeeChoices = employeeInfo.map((employee) => ({
        name: `${employee.firstname} ${employee.lastname}`,
        value: employee.id,
    }));
    const chosenEmployee = await inquirer.prompt([
        {
            message: 'Choose the employee that you want to update',
            name: 'employee',
            type: 'list',
            choices: employeeChoices
        },
    ]);
    const employeeId = chosenEmployee.employee;




    const updatedRole = await inquirer.prompt([
        {
            message: 'Choose a new role for this employee',
            name: 'role',
            type: 'list',
            choices: roleChoices
        }
    ]);

    const roleId = updatedRole.role;
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const values = [roleId, employeeId];

    try {
        await db.promise().query(query, values);
        console.log('employee role updated successfully');
    } catch (error) {
        console.error('error updating employee info', error);
    }

    mainMenu();
}


mainMenu();