const express = require('express')
const app = express()
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// schema
const bestProjects = require('./Model/bestProjects')
const review = require('./Model/review')
const showcase = require('./Model/showcase')
const user = require('./Model/user')
const blog = require('./Model/blog')

const port = process.env.PORT || 5000;
require('dotenv').config();
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
// middle war
async function verifyToken(req, res, next) {
    if (req.headers.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(idToken)

            console.log(decodedUser.email, 'hears');
            req.decodedUserEmail = decodedUser.email
        }
        catch (e) {

        }
    }
    next();
}

// default
const nodemailer = require("nodemailer");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.icikx.mongodb.net/my_next_js_server?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, () => {
    console.log('connect', uri)
}, e => console.log(e))
const uuid = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

async function run() {
    try {
        // await client.connect();
        // const database = client.db('portfolio');
        // const bestProjects = database.collection('best_projects');
        // const review = database.collection('reviews');
        // const showCase = database.collection('showCases');


        app.get('/user', async (req, res) => {
            const { email } = req.query;
            console.log(email, 'iddd');
            try {
                if (email) {
                    const result = await user.findOne({ email });
                    console.log(result);
                    res.json(result);
                }
                else {
                    const allUser = await user.find({});
                    res.json(allUser)
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({ error: 'something bd' })
            }

        })


        app.put('/user', async (req, res) => {
            try {
                const data = req.body;
                console.log(data);
                const filter = { email: data.email };
                const options = { upsert: true }
                const updateDoc = { $set: data }
                const result = await user.updateOne(filter, updateDoc, options);
                console.log(result);
                res.json(result);
            }
            catch {
                res.status(404).json({ error: 'data cant be save' });
            }

        })
        app.get('/bestprojects', async (req, res) => {
            const result = await bestProjects.find({});
            console.log(result);
            res.json(result)
        })
        app.post('/bestprojects', async (req, res) => {
            console.log('adding', req.body);
            const result = await bestProjects.create(req.body);
            console.log(result);
            res.json(result)
        })
        app.put('/bestprojects/:id', async (req, res) => {

            const id = req.params.id;
            const doc = { $set: req.body }
            const options = { upsert: true };
            const result = await bestProjects.findByIdAndUpdate(id, doc, options);
            console.log(result);
            res.json(result)

        })
        app.delete('/bestprojects/:id', async (req, res) => {
            console.log(req.body);
            console.log(req.params.id);
            const id = req.params.id;
            try {

                const result = await bestProjects.findByIdAndDelete(id);
                console.log(result);
                res.json(result)
            } catch (err) {
                res.status(400).json({ error: 'bad req' })
            }

        })

        app.get('/allReview', async (req, res) => {
            const result = await review.find({});
            res.json(result)
        })
        app.get('/allReviewShow', async (req, res) => {
            const result = await review.find({ show: true });
            res.json(result)
        })
        app.post('/addReview', async (req, res) => {
            const data = req.body;
            const result = await review.create(req.body);
            res.json(result)
        })
        app.put('/reviewUpdateShow/:id', async (req, res) => {
            const { value } = req.body;
            const { id } = req.params;
            try {
                const doc = { $set: { show: value } }
                const options = { upsert: true };
                const result = await review.findByIdAndUpdate(id, doc, options);
                console.log(result, id)
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.delete('/reviewUpdateShow/:id', async (req, res) => {
            const { id } = req.params;
            try {

                const result = await review.findByIdAndDelete(id);
                console.log(result, id)
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })

        app.get('/allShowcase', async (req, res) => {

            const result = await showcase.find({});
            console.log(result);
            res.json(result)
        })
        app.post('/addShowcase', async (req, res) => {
            try {

                const result = await showcase.create(req.body);
                console.log(result);
                res.json(result)
            } catch (err) {
                res.status(400).json({ error: 'bad req' })

            }
        })
        app.delete('/addShowcase/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await showcase.findByIdAndDelete(id);
                res.json(result)
            }
            catch (err) {
                res.status(400).json({ error: 'bad req' })
            }
        })


        // blogs

        app.get('/blog', async (req, res) => {
            // const result = await categories.create(req.body)
            try {

                const { id, short } = req.query
                console.log(id);
                let result;
                if (id) {

                    result = await blog.findById(id)
                } else if (short) {
                    result = await blog.find({}).sort({ _id: 1 }).select('heading description img address date').limit(10);
                }
                else {
                    // result = await blog.find({}).select('comments love heading description img address date');
                    result = await blog.find({});
                }
                res.json(result);
            }
            catch (e) {
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.get('/blog/recent', async (req, res) => {
            // const result = await categories.create(req.body)
            try {

                const result = await blog.find({}).sort({ _id: -1 }).limit(4)
                res.json(result);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.get('/blog/mostLoved', async (req, res) => {
            // const result = await categories.create(req.body)
            try {

                const result = await blog.aggregate([
                    { $unwind: "$love" },
                    {
                        $group: {
                            _id: "$_id",
                            heading: { "$first": "$heading" },
                            img: { "$first": "$img" },
                            address: { "$first": "$address" },
                            date: { "$first": "$date" },
                            len: { $sum: 1 }
                        }
                    },
                    { $sort: { len: -1 } },
                    { $limit: 3 }
                ])
                res.json(result);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ error: 'bad req' })
            }
        })
        app.post('/blog', verifyToken, async (req, res) => {
            const data = req.body;
            console.log(req.decodedUserEmail);
            try {
                if (data?.user === req?.decodedUserEmail) {
                    const createBlog = new blog(data.mainData);
                    const result = await createBlog.save();
                    res.json(result);
                } else {
                    res.status(400).json({ error: 'UnAuthorize' })
                }
            } catch (e) {
                console.log(e, 'eeror');
                res.status(400).json({ error: 'bad req' })
            }

        })
        app.put('/blog', verifyToken, async (req, res) => {
            const data = req.body;
            const { id } = req.query
            console.log(id, data.sections);

            console.log();
            try {
                if (data?.user === req?.decodedUserEmail) {
                    // const createBlog = new blog(data.mainData);
                    // const result = await createBlog.save();

                    const result = await blog.findByIdAndUpdate(id, data.mainData);
                    console.log(result);
                    res.json(result);
                } else {
                    res.status(400).json({ error: 'UnAuthorize' })
                }
            } catch (e) {
                console.log(e, 'eeror');
                res.status(400).json({ error: 'bad req' })
            }

        })

        app.put('/blog/comment', async (req, res) => {
            // const result = await categories.create(req.body)
            const { id } = req.query;
            console.log(req.body);
            let result;
            try {
                if (id) {
                    const thatBlog = await blog.findById(id);
                    const response = await thatBlog.comments.push(req.body)
                    const rs = await thatBlog.save()
                    res.json({ result: 'success' });
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({ error: 'something bd' })
            }


        });

        app.get('/blog/comment/recent', async (req, res) => {
            // const result = await categories.create(req.body)
            try {

                const result = await blog.aggregate([
                    { $unwind: "$comments" },
                    {
                        $group: {
                            _id: "$_id",
                            comments: { "$first": "$comments" },
                            len: { $sum: 1 }
                        }
                    },
                    { $sort: { time: -1 } },
                    { $limit: 3 }
                ])

                res.json(result);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ error: e.message })
            }
        })
        app.put('/blog/love', async (req, res) => {

            const { id } = req.query;
            const data = req.body;
            let result;

            try {
                if (id) {
                    const thatBlog = await blog.findById(id);
                    const res = await thatBlog.love.push(data)
                    const rs = await thatBlog.save()
                    res.json({ success: 'successfully saved' });
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({ error: 'something bd' })
            }


        })
        //delete blog 
        app.delete('/blog/delete', verifyToken, async (req, res) => {
            const { id } = req.query;
            const data = req.body;
            console.log(data.user, req?.decodedUserEmail);
            try {
                if (data?.user === req?.decodedUserEmail) {
                    if (id) {
                        const result = await blog.findByIdAndDelete(id);
                        // console.log(result);
                        console.log('delete');
                        res.json(result);
                    } else {
                        res.status(400).json({ error: 'something bad' })

                    }
                } else {
                    res.status(400).json({ error: 'UnAuthorize' })
                }
            } catch (e) {
                console.log(e);
                res.status(400).json({ error: 'something bd' })
            }


        });

        app.get('/totalUser', async (req, res) => {
            const allUser = await user.count();
            res.json({ user: allUser })

        })
        app.get('/totalCategories', async (req, res) => {
            const allCategories = await showcase.count();
            res.json({ categories: allCategories })

        })
        app.get('/last7blog', async (req, res) => {
            // const last7blog = await blog.find().sort({ _id: -1 }).limit(7).select('comments love')
            const result = await blog.aggregate([
                {
                    "$project":
                        { comment: { $size: "$comments" }, love: { $size: "$love" }, date: 1 }
                },
                { $sort: { _id: -1 } },
                { $limit: 7 }
            ])
            res.json(result)

        })
        app.get('/blogTotalLC', async (req, res) => {
            try {
                const result = await blog.aggregate([
                    {
                        "$project":
                            { comment: { $size: "$comments" }, love: { $size: "$love" } }
                    }
                ])
                res.json(result);
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ error: e.message })
            }
        })
        app.get('/blogCount', async (req, res) => {
            try {
                const result = await blog.count()
                res.json({ blog: result });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ error: e.message })
            }
        })




        app.post('/uploadImage', async (req, res) => {
            try {
                const { file } = req?.files;

                // console.log(file, 'get the fiel', uuid());
                if (file) {

                    await cloudinary.uploader.upload(file.tempFilePath,
                        {
                            resource_type: "image", public_id: "myfolder/images/" + file?.name.split('.')[0] + uuid(),
                            overwrite: true,
                        },
                        function (error, result) {
                            if (result) {

                                res.json({ url: result.url })
                            }
                            if (error) {
                                res.status(400).json({ error })


                            }
                            console.log({ result, error })
                        });
                }
            }
            catch (e) {
                console.log(e)
                res.status(400).json({ error: 'could not upload image' })
            }
        })

        app.post('/sendMail', async (req, res) => {

            try {
                const { user_name, user_email, profession, review } = req.body;
                console.log({ user_name, user_email, profession, review });
                const subject = `${user_name} ${profession} has send a review `
                // create reusable transporter object using the default SMTP transport
                const transport = await nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: "naimurrhman53@gmail.com",
                        pass: process.env.USER_PASS
                    }
                });
                // send mail with defined transport object
                const mailOptions = {
                    from: user_email,
                    to: 'naimurrhman53@gmail.com',
                    subject: subject,
                    text: review
                }
                await transport.sendMail(mailOptions, function (error, response) {
                    if (error) {

                        res.status(400).json({ res: 'error' })
                    } else {
                        res.send("Email has been sent successfully");
                        console.log('mail sent');
                        res.json({ res: 'success' })
                    }
                })
            } catch (err) {

                res.status(400).json({ res: 'error' })
            }

        })




    }
    finally {
        // await client.close(); 


    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Running server')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

