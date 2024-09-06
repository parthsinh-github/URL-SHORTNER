const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectToMongoDB } = require('./connect');

const urlRoute = require('./routes-url2');
const staticRoute = require("./staticRouter");
const userRoute = require("./routes/user");

const URL = require('./models-url2');

const {restrictTo,checkForAuthentication} = require("./middlewares/auth")

const app = express();
const PORT = 8001;

// Connect to MongoDB
async function initializeDatabase() {
  try {
    await connectToMongoDB('mongodb://127.0.0.1:27017/short-url2');
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

initializeDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// Routes

app.use("/url",restrictTo(["NORMAL","ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

// Redirect route
app.get("/url/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
