let customerdb = require('./customerdb.js'),
    express = require( 'express' ),
    serveStatic = require( 'serve-static' );

let custDB = new customerdb.CustomerDB();

let app = express();
app.use(express.static('public'));

const port = 3001;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/customers', (req, res) => {
    custDB.getCustomers2(res);
    console.log('done with custDB.getCustomers2()')
  } );

app.get('/updateCustomer', (req, res) => {
    custDB.updateCustomer(req.query, updateCustomerCallback(res));
});

function getCustomers(response) {
    let res = response;
    custDB.query('SELECT * FROM customer')
        .then(data => {
            let customerjson = '[';
            for (i = 0; i < data.length; i++) {
                if (customerjson.length > 1) {
                    customerjson = customerjson + ',';
                }
                customerjson = customerjson + `{"id":"${data[i].CustomerID.toString()}","first":"${data[i].FirstName}","last":"${data[i].LastName}","street":"${data[i].Street}","city":"${data[i].City}","state":"${data[i].State}","zip":"${data[i].Zipcode}","phone":"${data[i].Phone}"}`;
            }
            customerjson = customerjson + ']';
            console.log('customerjson: ' + customerjson);

            res.write(customerjson);
            res.end();
        })
        .catch(err => {
            console.log(err.sqlMessage)
        });
}

let updateCustomerCallback = function (response) {
    let innerCallback = function (err, data) {
        let res = response;
        if (err) {
            // error handling code goes here
            console.log("ERROR : ", err);
        } else {
            console.log(data);
            res.write(data.message);
            res.end();
        }

    }
    return innerCallback;
}



