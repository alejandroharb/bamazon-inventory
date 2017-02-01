var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user: 'root',
    password: 'tyson2626337',
    database: 'bamazon_db'
});

inquirer.prompt({
    type: 'list',
    choices: ['View Product Sales by Department', 'Create New Department'],
    message: 'Hi supervisor, what would you like to do?',
    name: 'choice'
}).then(function(response) {
    var supervisorChoice = response.choice;
    switch(supervisorChoice) {
        case 'View Product Sales by Department':
            displayDepartmentTable();
            break;
        case 'Create New Department':
            inquirer.prompt([{
                type: 'input',
                message: 'Enter name of new department: ',
                name: 'newDepartment'
            },{
                type: 'input',
                message: 'Whats the overhead of this department?',
                name: 'newDeptOverHead'
            }]).then(function(answer) {
                var newDepartment = answer.newDepartment;
                var deptOverHead = answer.newDeptOverHead;
                connection.query('INSERT INTO departments SET ?',
                {
                    department_name: newDepartment,
                    over_head_costs: deptOverHead
                }, function(err, res) {
                    if (err) throw err;
                    console.log("\n\n------------------------\nNew Department created!!\n------------------------\n\n");
                    displayDepartmentTable();
                })
            })
            break;
    }
})

function displayDepartmentTable() {
    connection.query('SELECT * FROM departments', function(err,res) {
        if(err) throw err;
        var table = [];
        var totalProfits = 0;
        for(var i = 0; i < res.length; i++) {
            if(res[i].total_sales === null) {
                totalProfits = -res[i].over_head_costs;
            } else {
                totalProfits = parseInt(res[i].total_sales) - parseInt(res[i].over_head_costs);
            }
            var row = [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].total_sales, totalProfits];
            table.push(row);
        }
        console.table(["ID","Department Name", "Over head Costs", "Product Sales", "Total Profits"],table);
        connection.end();
    });
}