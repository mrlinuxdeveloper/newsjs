const db = require('../DB')
const multer = require('multer')
const upload =multer({dest : 'public/image/'})
const fs = require('fs');
const path = require('path');


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
    const { id } = req.params;

    const sql = 'SELECT * FROM blogs WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching blog:', err);
            return res.status(500).send('خطا در دریافت اطلاعات بلاگ');
        }

        if (results.length === 0) {
            return res.status(404).send('بلاگ پیدا نشد');
        }

        const blog = results[0];

        // اینجا اسم ویوتون رو بذارید (مثلاً edit.ejs یا edit.pug)
        res.render('blog/edit', { blog });
    });
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
    const { id } = req.params;
    const { name, content } = req.body;

    // اول اطلاعات فعلی بلاگ رو می‌گیریم
    db.query('SELECT image FROM blogs WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('خطا در دریافت اطلاعات');
        }

        if (results.length === 0) {
            return res.status(404).send('بلاگ پیدا نشد');
        }

        const oldImage = results[0].image;
        let newImage = oldImage; // به صورت پیش‌فرض همان عکس قبلی

        // اگر عکس جدید آپلود شده باشد
        if (req.file) {
            newImage = req.file.filename;

            // پاک کردن عکس قبلی (اگر وجود داشت)
            if (oldImage) {
                const oldImagePath = path.join(__dirname, '../public/image', oldImage);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('خطا در حذف عکس قبلی:', err.message);
                    } else {
                        console.log('عکس قبلی حذف شد:', oldImage);
                    }
                });
            }
        }

        // آپدیت دیتابیس
        const sql = `
            UPDATE blogs 
            SET name = ?, content = ?, image = ? 
            WHERE id = ?
        `;

        db.query(sql, [name, content, newImage, id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('خطا در آپدیت بلاگ');
            }

            res.redirect('/');
        });
    });
}

// Delete

function Delete(req, res) {
    const { id } = req.params;

    // اول اطلاعات بلاگ رو می‌گیریم تا اسم عکس رو داشته باشیم
    db.query('SELECT image FROM blogs WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error finding blog:', err);
            return res.status(500).send('خطا در پیدا کردن بلاگ');
        }

        if (results.length === 0) {
            return res.status(404).send('بلاگ پیدا نشد');
        }

        const imageName = results[0].image;

        // حذف رکورد از دیتابیس
        db.query('DELETE FROM blogs WHERE id = ?', [id], (err) => {
            if (err) {
                console.error('Error deleting blog:', err);
                return res.status(500).send('خطا در حذف بلاگ');
            }

            // اگر عکس وجود داشت، فایل رو هم پاک کن
            if (imageName) {
                const imagePath = path.join(__dirname, '../public/image', imageName);

                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('خطا در حذف فایل عکس:', err.message);
                        // حتی اگر عکس پاک نشد، باز هم ریدایرکت می‌کنیم
                    } else {
                        console.log('عکس با موفقیت حذف شد:', imageName);
                    }

                    res.redirect('/blog');
                });
            } else {
                res.redirect('/blog');
            }
        });
    });
}

module.exports = {
    Index, Create, Edit, Show, Update, Delete, Upload
};