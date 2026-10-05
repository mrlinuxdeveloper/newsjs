const db = require('../DB')
const multer = require('multer')
const upload =multer({dest : 'public/image/'})



// Index
function Index(req, res) {
    res.render('blog/index', {
        success: req.query.success === '1'
    });}
// Create
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const Upload = multer({ storage });

function Create(req, res) {
    const { name, content } = req.body;
    const file = req.file;

    if (!name || !content || !file) {
        return res.status(400).send('نام، محتوا و تصویر الزامی هستند');
    }

    const image = file.filename;
    const sql = 'INSERT INTO blogs (name, content, image) VALUES (?, ?, ?)';

    db.query(sql, [name, content, image], (err, result) => {
        if (err) {
            console.error('Error creating blog:', err);
            return res.status(500).send('خطا در ذخیره بلاگ');
        }

        res.redirect('/blog?success=1');
    });
}




// function Create(req, res) {
//     // console.log(req.body);
//     const {name, content} = req.body;
//     const file = req.file;
//     if (!name || !content || !file) {
//         return res.status(400).send('نام و محتوا الزامی هستند');
//     }
//     let image = file.originalname()
//     const sql = 'INSERT INTO blogs (name, content, image) VALUES (?, ?)';
//
//     db.query(sql, [name, content, image], (err, result) => {
//         if (err) {
//             console.error('Error creating blog:', err);
//             return res.status(500).send('خطا در ذخیره بلاگ');
//         }
//
//         res.redirect('/blog?success=1');
//     });
// }
// Edit
function Edit(req, res) {
    const id = req.params.id;
    res.render(`فرم ویرایش بلاگ شماره ${id} — هنوز پیاده‌سازی نشده`);

}
// Show
function Show(req, res) {
    const id = req.params.id;
    // res.render('blog/show', {
    //     title: 'show',
    //     id: id
    // })
    let sql = "SELECT * FROM blogs WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error select blog for id:', err);
            return res.status(500).send('خطا در دریافت بلاگ');
        }

        if (result.length === 0) {
            return res.status(404).render('404'); // یا هر پیامی که می‌خوای
        }

        res.render('blog/show', {
            title: 'show',
            blog: result[0]   // 👈 آبجکت تکی، نه آرایه
        });
    });
}
// Update
function Update(req, res) {
    res.send('بروزرسانی هنوز پیاده‌سازی نشده');
}
// Delete
function Delete(req, res) {
    const {id} = req.params;
    db.query('DELETE FROM blogs WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting blog:', err);
            return res.status(500).send('خطا در حذف بلاگ');
        }
        res.redirect('/blog');
    });
}

module.exports = {
    Index, Create, Edit, Show, Update, Delete, Upload
};