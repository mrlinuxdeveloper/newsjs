const db =require('../DB')

function Home(req, res) {
    let sql = "SELECT * FROM blogs";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating blog:', err);
            return res.status(500).send('خطا در ذخیره بلاگ');

        }
        res.render('home',{
            title: 'home',
            result: result
        });
    })


}
module.exports = Home;