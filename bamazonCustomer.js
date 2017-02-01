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

connection.query('SELECT * FROM products', function(err,res) {
    if(err) throw err;
    var table = [];
    for(var i = 0; i < res.length; i++) {
        var row = [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price,res[i].stock_quantity];
        table.push(row);
    }
    console.table(["ID","Item", "Department", "Price", "Stock"],table);
    customerPrompt();
});
function displayTable(table) {
    connection.query('SELECT * FROM ' + table, function(err,res) {
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

function customerPrompt() {
    inquirer.prompt([
            {
                name: 'itemID',
                type: 'input',
                message: 'What item would you like to buy? Enter item ID:'
            },
            {
                type: 'input',
                message: 'How many would you like to buy?',
                name: 'buyQuantity'
            }]).then(function(answer) {
                var buyItemID = answer.itemID;
                var buyQuantity = answer.buyQuantity;
                connection.query('SELECT price, department_name, stock_quantity FROM products WHERE ?', {item_id: buyItemID} , function(err,res) {
                    var price = res[0].price;
                    var quantity = res[0].stock_quantity;
                    var departmentName = res[0].department_name;
                    if(buyQuantity > quantity) {
                        console.log("==================== \nInsufficient Quantity!\n====================");
                    } else {
                        var newStockQuantity = parseInt(quantity) - parseInt(buyQuantity);
                        var totalSales = parseInt(price) * parseInt(buyQuantity);
                        console.log("\n\n+------------------+\n| PURCHASE DETAILS |\n+------------------+\n  Total Cost: " +totalSales + "\n  Number of Items Purchased: " + buyQuantity+"\n\n");
                        connection.query('UPDATE departments SET ? WHERE ?',[
                            {
                                total_sales: totalSales
                            },{
                                department_name: departmentName
                            }],
                            function(err,res) {return});
                        connection.query('UPDATE products SET ? WHERE ?', [
                            {stock_quantity: newStockQuantity},
                            {item_id: buyItemID}],
                            function(err,res) {
                                displayTable("products");
                        })
                    }

            })
    })
}



