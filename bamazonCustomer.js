// Adding my dependencies/ npm packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var PrettyTable = require('prettytable');


// configure the connection to my server
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,
  
    user: "root",
  
    password: "Easyas123",
    database: "bamazon"
});

// initiate the connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // the call to our displayItemsForSale() function when a connection has been made
    displayItemsForSale();
});

// this function is what displays the current items for sale by their item_id, product_name, and price
function displayItemsForSale(){
    // this is our variable used in styling the way our 'menu' appears in the console
    // ID, Name, and Price
    let headers = ['Item ID', 'Name', 'Price']
    // Our empty array we will push the inventory into from mysql
    let itemsForSale = [];

    // here we run our query that takes in two parameters
    // the first is our SELECT method displaying our items for sale FROM the Products table
    // the second is the function we are running on that table that takes in two parameters
    // first the err, second the res
    connection.query("SELECT * FROM Products", function(err, res) {
        if (err) throw err;
        // this is our for() iterating through our res object 
        for (var i = 0; i < res.length; i++) {
            // variable called item is used to store the response in a string
            // from the respsone we are using dot notation to display the item_id, product_name, and price
            var item = [res[i].item_id, res[i].product_name, res[i].price];
            // using the .push() method to pusho our new item variable into the itemsForSale variable at the end of the array
            itemsForSale.push(item);
            // console.log(item)
        }
        // The instance of PrettyTable
        var pt = new PrettyTable();
        // using .create() on our pt using two arguments first is the headers second is the data we want to display itemsForSale array
        pt.create(headers, itemsForSale);
        // we are displaying the table in the console
        pt.print();
        // once we finish gathering our information from mysql and displaying it to the customer we call the cusometInput() function
        customerInput();
      });

};

// the customerInput() function displays questions in the console
// receives the answers and gives a total bill based on the input received
function customerInput(){
    // we are calling a .prompt() on our inquirer instance
    inquirer
        // .prompt() is a complex struncture where it takes in a type, variable name, and messages etc
        .prompt([
            {
                // here we are using the 'input' type
                type: 'input',
                // we are going to give it a variable name of 'item'
                name: 'item',
                // We would like to ask a question when trying to receive this input
                message: 'Using the Item ID, what item would you like to buy?'
            },
            {
                // once the first question has been completed we move onto the next
                // we are doing another 'input'
                type: 'input',
                // we are going to name the variable 'quantity'
                name: 'quantity',
                // our message will be another question
                message: 'How many would you like?'
            }     
        ])
        // this is our promise with our callback function
        // we are going to pass an argument through the function called answers
        .then(function(answers) {
            // declaring a const that will be our answers variable for our function
            // this will contain our response from the 'item' question and 'quantity' question
            const { item, quantity } = answers;
            // parseInt() takes in a string and returns an integer
            // it takes in two parameters the string and the radix or number system
            var qty = parseInt(quantity, 10)
            // SELECT query returning product_name, price, stock_quantity 
            // FROM the bamazon.Products table
            // WHERE the item_id = '?' (? is our input from answers)
            var stockquery = 'SELECT product_name, price, stock_quantity FROM bamazon.Products WHERE item_id = ?';

            // .query() taking in our stockquery SELECT query 
            // parseInt our item
            // running a callback function that takes in err, results, and fields
            connection.query(stockquery, [parseInt(item, 10)], function (err, results, fields) {
                if (err) throw err;
                // using dot notation we are accesing the results response object and assigning them variables 
                var selectedItem = results[0].product_name;
                var selectedItemPrice = results[0].price;
                var selectedItemQuantity = results[0].stock_quantity;
                // taking our selectedItemPrice and multiplying it by requested quantity
                var totalPrice = selectedItemPrice * qty;

                // using and if() statement to compare our selectedItemQuantity to our qty on hand
                if (qty >0 && qty <= selectedItemQuantity) {
                    connection.query(
                      "UPDATE Products SET ? WHERE ?",
                      [
                        {
                            // using key  value pairs we SET our myqql database with the new quantity
                            stock_quantity: (selectedItemQuantity - qty)
                        },
                        {
                            // WHERE our item_id matches our item
                            item_id: item
                        }
                      ],
                      function(error) {
                        if (error) throw err;
                        // displaying your total bill to the console
                        console.log('***\n\nYour selected item: ' + selectedItem + '\nTotal Bill: ' + totalPrice + '\n\n***\n\n');
                        
                      }
                    );
                  }else if(qty <= 0){
                    //   if you make a selection that is less than 0 you will receive this message in the console
                    console.log('***\n\nInvalid Quantity!\n\n***\n\n');
                  }else{
                    //   if there is not of this item on hand you will receive this error message
                    console.log('***\n\nInsufficient Quantity!\n\n***\n\n');  
                  }
                  ;
                //   When we are finished we we will run our displayItmesForSale funtion
                  displayItemsForSale();
            });

        });
};


