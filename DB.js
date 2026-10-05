
const mysql = require('mysql');
require('dotenv').config();


 const con = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    con.connect((err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
            return;
        }

        console.log('Connected to MySQL!');

    });

    module.exports = con;

//   function DB(app) {
//     const con = mysql.createConnection({
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//     });
//
//     con.connect((err) => {
//         if (err) {
//             console.error('Database connection failed:', err.message);
//             return;
//         }
//         app.listen(3000, () => {
//             console.log('Server running on port 3000');
//         });
//         console.log('Connected to MySQL!');
//
//     });
//
//     // app.locals.db = con;
// }
// module.exports = DB;

