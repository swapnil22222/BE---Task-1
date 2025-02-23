const express = require("express");
const app = express();
const fs = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------

let posts = "";

// Load posts from JSON file at server startup
async function loadPosts() {
  try {
    const data = await fs.readFile("posts.json", "utf8");
    posts = JSON.parse(data);
    console.log("Posts loaded successfully!");
  } catch (err) {
    console.error("Error loading posts:", err);
    posts = []; // Initialize empty if file doesn't exist
  }
}

// Save posts to JSON file (only when updated)
async function savePosts() {
  try {
    await fs.writeFile("posts.json", JSON.stringify(posts, null, 2));
    console.log("Posts saved successfully!");
  } catch (err) {
    console.error("Error saving posts:", err);
  }
}

// Load posts at startup
loadPosts();

app.get("/posts", (req, res) => {
  console.log(posts);
  res.render("home", { posts });
});

app.get("/posts/addPost", (req, res) => {
  res.render("addPost");
});

app.post("/posts", async (req, res) => {
  const { author, title, content, description } = req.body;
  const newPost = {
    id: uuid(),
    author: author,
    title: title,
    description: description,
    post: content,
  };

  await posts.push(newPost);

  await savePosts();

  res.redirect("/posts");
});

app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  let post = "";
  for (let p of posts) {
    if (p.id === id) {
      post = p;
      break;
    }
  }
  res.render("post", { post });
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  posts = posts.filter((c) => c.id != id);

  await savePosts();

  res.redirect("/posts");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
