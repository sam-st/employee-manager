const inquirer = require('inquirer');
const queries = require('./assets/queries');

function init() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'Add an employee',
        'Update employee role',
        'View all roles',
        'Add a role',
        'View all departments',
        'Add a department',
        'Exit'
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          queries.viewAllDepartments((results) => {
            console.table(results);
            init();
          });
          break;
        case 'View all roles':
          queries.viewAllRoles((results) => {
            console.table(results);
            init();
          });
          break;
        case 'View all employees':
          queries.viewAllEmployees((results) => {
            console.table(results);
            init();
          });
          break;
        case 'Add a department':
          inquirer.prompt({
            name: 'departmentName',
            type: 'input',
            message: 'What is the new department called?'
          }).then((answer) => {
            queries.addDepartment(answer.departmentName, (results) => {
              if (results) {
                console.log("Department added successfully!");
              } else {
                console.log("An error occurred.");
              }
              init();
            });
          });
          break;
        case 'Add a role':
          queries.viewAllDepartments((departments) => {
            const departmentChoices = departments.map((dept) => {
              return { name: dept.name, value: dept.name };
            });

            inquirer.prompt([
              {
                name: 'roleTitle',
                type: 'input',
                message: 'What is the title of the new role?'
              },
              {
                name: 'roleSalary',
                type: 'input',
                message: 'What is the salary for this role?',
                validate: (value) => {
                  var valid = !isNaN(parseFloat(value));
                  return valid || 'Please enter a number';
                },
                filter: Number
              },
              {
                name: 'departmentName',
                type: 'list',
                message: 'Which department does this role belong to?',
                choices: departmentChoices
              }
            ]).then((answers) => {
              const newRole = {
                title: answers.roleTitle,
                salary: answers.roleSalary,
                department_name: answers.departmentName
              };
              queries.addRole(newRole, (results) => {
                if (results) {
                  console.log("Role added successfully!");
                } else {
                  console.log("An error occurred.");
                }
                init();
              });
            });
          });
          break;
        case 'Add an employee':
          // Fetch roles and employees for dropdowns
          Promise.all([
            new Promise((resolve) => {
              queries.viewAllRoles((roles) => {
                resolve(roles);
              });
            }),
            new Promise((resolve) => {
              queries.viewAllEmployees((employees) => {
                resolve(employees);
              });
            })
          ]).then(([roles, employees]) => {
            const roleChoices = roles.map((role) => {
              return { name: role.title, value: role.title };
            });

            const managerChoices = employees.map((employee) => {
              return { name: `${employee.first_name} ${employee.last_name}`, value: employee.first_name + ' ' + employee.last_name };
            });
            managerChoices.push({ name: "None", value: null });

            inquirer.prompt([
              {
                name: 'firstName',
                type: 'input',
                message: 'Employee\'s first name:'
              },
              {
                name: 'lastName',
                type: 'input',
                message: 'Employee\'s last name:'
              },
              {
                name: 'roleName',
                type: 'list',
                message: 'Employee\'s role:',
                choices: roleChoices
              },
              {
                name: 'managerName',
                type: 'list',
                message: 'Employee\'s manager:',
                choices: managerChoices
              }
            ]).then((answers) => {
              queries.addEmployee({
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_name: answers.roleName,
                manager_name: answers.managerName
              }, (results) => {
                if (results) {
                  console.log("Employee added successfully!");
                } else {
                  console.log("An error occurred.");
                }
                init();
              });
            });
          });
          break;
        case 'Update an employee role':
          // Fetch the list of employees and roles
          Promise.all([
            new Promise((resolve) => {
              queries.viewAllEmployees((employees) => {
                resolve(employees);
              });
            }),
            new Promise((resolve) => {
              queries.viewAllRoles((roles) => {
                resolve(roles);
              });
            })
          ]).then(([employees, roles]) => {
            const employeeChoices = employees.map((employee) => {
              return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id }; // Use employee's ID as the value
            });

            const roleChoices = roles.map((role) => {
              return { name: role.title, value: role.id };
            });

            inquirer.prompt([
              {
                name: 'employeeId', // Change the name to match the value you want to receive
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
              },
              {
                name: 'newRoleId',
                type: 'list',
                message: 'Which role do you want to assign to the selected employee?',
                choices: roleChoices
              }
            ]).then((answers) => {
              queries.updateEmployeeRole(answers.employeeId, answers.newRoleId, (results) => {
                if (results) {
                  console.log("Employee's role updated successfully!");
                } else {
                  console.log("An error occurred.");
                }
                init();
              });
            });
          });
          break;
        case 'Exit':
          process.exit();
      }
    });
};

init();