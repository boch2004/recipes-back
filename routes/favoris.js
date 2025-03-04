
const express = require("express")
const Favoris = require("../models/favoris")
const favorisRouter = express.Router()

//add favoris
favorisRouter.post("/add", async (req, res) => {
    try {
        let newfavoris = new Favoris(req.body);
        let result = await newfavoris.save();
        res.send({ favoris: result, msg: "favoris is added" })
    } catch (error) {
        console.log(error)
    }
})
//get all favoris
favorisRouter.get("/", async (req, res) => {
    try {

        let result = await Favoris.find();
        res.send({ favoris: result, msg: "all favoris" })
    } catch (error) {
        console.log(error)
    }
})



//get one favoris
favorisRouter.get("/:id", async (req, res) => {
    try {

        let result = await Favoris.findById(req.params.id);
        res.send({ favoris: result, msg: "one favoris" })
    } catch (error) {
        console.log(error)
    }
})

//delete favoris
favorisRouter.delete("/:id", async (req, res) => {
    try {

        let result = await Favoris.findByIdAndDelete(req.params.id);
        res.send({ msg: "favoris is deleted" })
    } catch (error) {
        console.log(error)
    }
})




//edit favoris
favorisRouter.put("/:id", async (req, res) => {
    try {

        let result = await Favoris.findByIdAndUpdate(
            { _id: req.params.id }, { $set: { ...req.body } }
        );
        res.send({ msg: "favoris is updated" })
    } catch (error) {
        console.log(error)
    }
})






module.exports = favorisRouter