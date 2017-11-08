var cheerio = require("cheerio");
var request = require("request");

console.log("Grabbing articles")


request("https://www.macrumors.com/", function(error, response, html){

  var $ = cheerio.load(html);

  var results = [];

  $(".article h2.title a").each(function(i, element){

    var title = $(element).text();
    var link = $(element).attr("href");

    results.push({
      title: title,
      link: link
    });
  });

console.log(results);
});
