const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const user = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  loginRules,
  registerRules,
  validation,
} = require("../middleware/validator");
const isAuth = require("../middleware/passport");

//register
router.post("/register", registerRules(), validation, async (req, res) => {
  const { name, lastname, email, password, category, img } = req.body;
  try {
    const newUser = new User({ name, lastname, email, password,category, img });
    // check if the email exist
    const searchedUser = await User.findOne({ email });

    if (searchedUser) {
      return res.status(400).send({ msg: "email already exist" });
    }

    // hash password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    console.log(hashedPassword);
    newUser.password = hashedPassword;
    // generation token
    //save  the user
    const newUserToken = await newUser.save();
    const payload = {
      _id: newUser._id,
      name: newUserToken.name,
    };
    const token = await jwt.sign(payload, process.env.SecretOrkey, {
      expiresIn: 3600,
    });

    res
      .status(200)
      .send({ newUserToken, msq: "user is saved", token: `bearer ${token}` });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
//login
router.post("/login", loginRules(), validation, async (req, res) => {
  const { email, password } = req.body;
  try {
    //find if the user exist
    const searchedUser = await User.findOne({ email });
    //find if the email not exist
    if (!searchedUser) {
      return res.status(400).send({ msg: "Bad credential" });
    }
    //if password are equal
    const match = await bcrypt.compare(password, searchedUser.password);
    if (!match) {
      return res.status(400).send({ msg: "Bad credential" });
    }
    //creer un token
    const payload = {
      _id: searchedUser._id,
      name: searchedUser.name,
    };
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: 3600,
    });
    //console.log(token)
    //send the user
    res
      .status(200)
      .send({ user: searchedUser, msg: "success", token: `bearer ${token}` });
  } catch (error) {
    res.status(500).send({ msg: "Can not get the user" });
  }
});

router.get("/current", isAuth(), (req, res) => {
  res.status(200).send({ user: req.user });
});


//delete user
router.delete("/:id", async (req, res) => {
  try {

      let result = await User.findByIdAndDelete(req.params.id);
      res.send({ msg: "user is deleted" })
  } catch (error) {
      console.log(error)
  }
})




//edit user
router.put("/:id", async (req, res) => {
  try {

      let result = await User.findByIdAndUpdate(
          { _id: req.params.id }, { $set: { ...req.body } }
      );
      res.send({ msg: "user is updated" })
  } catch (error) {
      console.log(error)
  }
})

//get all users
router.get("/", async (req, res) => {
  try {

      let result = await User.find();
      res.send({ users: result, msg: "all users" })
  } catch (error) {
      console.log(error)
  }
})

//add favourite
  router.post('/toggle-favorite', async (req, res) => {

  try {
    const { userId, recipeId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // التحقق مما إذا كانت الوصفة مضافة للمفضلة
    const isFavorited = user.favorites.includes(recipeId);

    if (isFavorited) {
      // إذا كانت مضافة، يتم إزالتها
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
    } else {
      // إذا لم تكن مضافة، يتم إضافتها
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json({ favorites: user.favorites, message: isFavorited ? "Removed from favorites" : "Added to favorites" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})




module.exports = router;
