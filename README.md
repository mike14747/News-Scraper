# News-Scraper

## What the project does:

* This project allows users to scrape up to 10 baseball headlines at a time from my 3 favorite baseball websites (baseballamerica.com, fangraphs.com and mlb.com) and save them to Mongo DB.
* It also allows users to save/update notes for each article... as well as providing them the ability to delete an individual article or even all of the articles with a single button click.

---

## How users can get started with the project:

To use this project, you'll need to do the following:

* Clone this repository onto your computer or upload it to heroku.
* If you're running it locally on your pc, also perform these steps:
    * Install Mongo DB.
    * Run **npm i** from the terminal (this will install the npm modules: express, express-handlebars, handlebars-helpers, axios, cheerio and mongoose).
    * Run ***node server** from the terminal, then browse to **localhost:3000**.
* If you're deploying it to Heroku, also perform these steps:
    * Create the Heroku app in the terminal.
    * Run: 'heroku addons:create mongolab' from the terminal to setup Mongo DB for this app.
---

## About the code in this project:

This is the code I used to add a note to an article. First, it add a note to the **notes** collection. Then, it takes the returned note id and adds it to the associated article in the **articles** collection (the MongoDB equivalent of a foreign key).
```
router.post("/api/note", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => db.Article.findOneAndUpdate({ _id: req.body.article_id }, { note: dbNote._id }, { new: true }))
        .then((dbArticle) => res.json(dbArticle))
        .catch(error => res.status(500).send({ error: error }));
});
```
<br />

I had to add these properties in the server.js file to get rid of a couple of Mongo DB deprecation errors:
```
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false }, error => {
    // connected message goes here
});
```
<br />

Since there are going to be multiple notes that can be updated on the articles page, I had to come up with a way to capture the textareas and link them to the correct note id. I settled on using the JQuery element name selector on the textarea and the hidden input field for the note id.
```
$(".update_note").on("click", event => {
    event.preventDefault();
    const note_info = {
        text: $("form textarea[name=note_text]").val().trim(),
        note_id: $("form input[name=note_id]").val()
    }
    $.ajax('/api/note/update', {
        type: 'PUT',
        data: note_info
    }).then(response => $(location).attr('href', '/articles'));
});
```
<br />

The npm module **handlebars-helpers** was used to add MomentJS date formatting on the saved articles page. Just having that package installed and required in server.js allowed me to include moment right in the articles.handlebars file.
```
<div class="p-2 text-dkgreen"><span class="small muted">Source:</span> {{ website }} / <span class="small muted">Date Scraped:</span> {{ moment date format="MMM DD, YYYY" }}</div>
```
<br />

In one of the 3 baseball websites I'm scraping headlines from (baseballamerica.com), I noticed that some of the headlines used relative paths and some used absolute paths. So, I had to add a condition that checks for it before sending the url of the article to the database... and prepending it with the path necessary to make it simulate an absolute path if needed.
```
router.get("/scrape/baseballamerica", (req, res) => {
    let counter = 0;
    axios.get("https://www.baseballamerica.com/").then(response => {
        const $ = cheerio.load(response.data);
        const results = [];
        $("li.headline").each(function (i, element) {
            const title = $(element).children().text();
            let link = $(element).find("a").attr("href");
            if (!link.startsWith("http")) {
                link = `https://www.baseballamerica.com${link}`;
            }
            const website = "Baseball America";
            counter++;
            if (counter < 10) {
                results.push({
                    title: title,
                    link: link,
                    website: website
                });
            }
        });
        db.Article.create(results)
            .then(dbArticle => console.log(dbArticle))
            .catch(err => console.log(err));
        res.redirect("/articles");
    });
});
```
<br />

This app is using all ES6 approved code.
* Arrow functions (when possible)
* const and let (with no use of var)
* Template literals to concatenate strings

---

## More Info about this project:

* To find out more about the npm modules used in this project:    
  * https://www.npmjs.com/package/express
  * https://www.npmjs.com/package/express-handlebars
  * https://www.npmjs.com/package/handlebars-helpers
  * https://www.npmjs.com/package/axios
  * https://www.npmjs.com/package/cheerio
  * https://www.npmjs.com/package/mongoose

---

## This project was created and is maintained by:

* Mike Gullo
* Live version: https://desolate-badlands-16289.herokuapp.com/
* This project's github repo: https://github.com/mike14747/News-Scraper
* Me on github: https://github.com/mike14747
* Contact me at: mike14747@oh.rr.com for more info about this project.