const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const userRouter = require('./routes/users.js')
const postRouter = require('./routes/posts.js')



// Body parser middlware
// we have access to the parsed data within our routes.
// The parsed data will be located in "req.body".
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
    const time = new Date();

    console.log(
        `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
    );
    if (Object.keys(req.body).length > 0) {
        console.log('Containing the data:');
        console.log(`${JSON.stringify(req.body)}`);
    }
    next();
});

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
    var key = req.query["api-key"];

    // Check for the absence of a key.
    if (!key) {
        res.status(400);
        return res.json({ error: "API Key Required" });
    }

    // Check for key validity.
    if (apiKeys.indexOf(key) === -1) {
        res.status(401);
        return res.json({ error: "Invalid API Key" });
    }

    // Valid key! Store it in req.key for route access.
    req.key = key;
    next();
});


//API routes
app.use('/api/users', userRouter)
app.use('/api/posts', postRouter)


app.get('/', (req, res) => {
    res.send('Work in progress');
});

// 404 Middleware
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Resource Not Found' });
});


// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
  });
  

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});