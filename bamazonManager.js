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

inquirer.prompt(
    [{
        type: 'list',
        message: 'Hi Manager! What would you like to do?',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: 'managerChoice'
    }]).then(function(response) {
        var choice = response.managerChoice;
        switch(choice) {
            case "View Products for Sale":
                displayTable();
                break;
            case "View Low Inventory":
                displayLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                //function
                break;
        }
    })

function displayTable() {
    connection.query('SELECT * FROM products', function(err,res) {
        if(err) throw err;
        var table = [];
        for(var i = 0; i < res.length; i++) {
            var row = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,res[i].stock_quantity];
            table.push(row);
        }
        console.table(["ID","Item", "Department", "Price", "Stock"],table);
        connection.end();
    });
}

function displayLowInventory() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5',function(err,res) {
        if(err) throw err;
        var table = [];
        for(var i = 0; i < res.length; i++) {
            var row = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,res[i].stock_quantity];
            table.push(row);
        }
        console.table(["ID","Item", "Department", "Price", "Stock"],table);
        connection.end();
    });
}

function addInventory() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'To which item would you like to add inventory?',
            name: 'addItem'
        },{
            type: 'input',
            message: 'How much inventory would you like to add?',
            name: 'addQuantity'
        }]).then(function(response) {
            var itemID = response.addItem;
            var addQuantity = response.addQuantity;
            connection.query('SELECT item_id, stock_quantity FROM products WHERE ?', {item_id: itemID}, function(err,res) {
                if(err) throw err;
                var currQuantity = res[0].stock_quantity;
                var updatedQuantity = parseInt(currQuantity) + parseInt(addQuantity);
                connection.query('UPDATE products SET ? WHERE ? ',
                    [{stock_quantity: updatedQuantity},{item_id: itemID}],
                    function(err,res) {
                    if(err) throw err;
                    console.log("\n\nUpdate Inventory stock for item #" + itemID + " to a total of " + updatedQuantity + " units!\n\n")
                    displayTable()
                });
            })

        })
}