const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // return cb(null, "./resources/images/")
        return cb(null, 'G:\\Node\\Express\\');
    },
    filename(req, file, cb) {
        return cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send('successfully uploaded!');
});

app.get('/download', (req, res) => {
    //   console.log(req.params.name)
    res.download('G:\\Node\\Express\\1693811648375_Capture.PNG', 'abc');
});

app.listen(4000, () => {
    console.log('Server is running');
});
