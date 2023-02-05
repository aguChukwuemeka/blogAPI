import express from "express";
import User from "../models/user";
import Post from "../models/post";

const router = express.Router();

// CREATE
router.post("/", async (req, res, next) => {
    const newPost = new Post(req.body);
  try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
  } catch (err) {
      res.status(500).json(err);
  }
});

// UPDATE
router.patch("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
          const updatePost = await Post.findByIdAndUpdate(req.params.id, {
              $set: req.body,
          }, { new: true }
          );
        res.status(200).json(updatePost);
      } catch (err) {
          res.status(500).json(err);
      }
    } else {
        res.status(401).json("You can update only your post");
    }
  } catch (err) {
      res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
          await post.delete();
          res.status(200).json('Post has been deleted');
      } catch (err) {
          res.status(500).json(err);
      }
    } else {
        res.status(401).json("You can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET_ALL & Query
router.get('/', async (req, res, next) => {
    const username = req.query.user;
    const category = req.query.category;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (category) {
            posts = await Post.find({
              categories: {
                $in: [category],
              },
            });
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;
