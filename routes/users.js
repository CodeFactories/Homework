import express from "express";
import { getAllUsers, addUser, deleteUser } from '../db/userModel.js';

const router = express.Router();

router.get("/", (req, res) => {
  const users = getAllUsers();
  res.render("users/index", { title: "Users", users });
});

router.get("/:id", (req, res) => {
  const users = getAllUsers();
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.render("users/profile", { title: `Profile: ${user.name}`, user });
});

router.post('/add', (req, res) => {
    const { name, email } = req.body;
    addUser(name, email);
    res.redirect('/users');
});

router.post('/delete/:id', (req, res) => {
    const { id } = req.params;      // get the user ID from the URL
    deleteUser(id);
    res.redirect('/users');          // redirect back to the users page
});

export default router;
