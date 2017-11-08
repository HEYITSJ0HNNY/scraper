// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

app.get("/", function(req, res) {
    res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});

app.get("/scrape", function(req, res) {
    request("https://www.macrumors.com/", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".article h2.title a").each(function(i, element) {

            var title = $(element).text();
            var link = $(element).attr("href");

            if (title && link) {
                db.scrapedData.insert({
                        title: title,
                        link: link
                    },
                    function(err, inserted) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(inserted);
                        }
                    });
            }
        });
    });
    res.send("scrape complete");
});

app.listen(3000, function() {
    console.log("App running on port 3000!");
});
