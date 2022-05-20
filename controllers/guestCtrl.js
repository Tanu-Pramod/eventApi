const guestModel = require("../models/guestModel");
const mongoose = require('mongoose');
const eventModel = require('../models/eventModel');

const save = async (req, res) => {

   const { guest_name, contact, email, event } = req.body;

   console.log("body======", req.body)
   console.log("file", req.file)


   let isValid = true;
   let error = [];

   if (guest_name === "" || isNaN(guest_name) === false || guest_name === undefined) {
      isValid = false;
      error.push("Invalid name")
   }
   console.log('L1' + isValid)

   if (isValid) {
      const g_event = await eventModel.findById(event)

      // //to convert file to base64
      // const encoded = req.file.buffer.toString('base64')

      // console.log("encode----",encoded)

      let file_name = req.file.filename;
      const newGuest = { guest_name, contact, email, event: g_event, file_name }

      newGuest.image = file_name;
      //appending basse64 file to newGuest object 
      // newGuest.image = encoded



      guestModel.create(newGuest)
         .then(async (data) => {

            res.redirect("/guestIndex/guestlist");
         })

         .catch(err => {
            res.status(500).send({
               message:
                  err.message || "Some error occurred while creating the DATA."
            });
         });
   }

   else {

      let payload = {};
      payload['title'] = "title";
      payload['titleguest'] = "Error";
      payload['error'] = error;
      payload = { ...req.body, ...payload };
      res.render('guest', payload);
   }
}

const guestlist = (req, res) => {
   const titleguest = req.query.titleguest;
   var name = titleguest ? { name: { [Op.like]: `%${titleguest}%` } } : null;

   guestModel.find()
      .then(async (data) => {
         let payload = { titleguest: "Guest List", data };
         res.json(payload);
         //res.render('guestlist', payload);
      })
      .catch(err => {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving data."
         });
      });
};

const deleteGuest = (req, res) => {
   const id = req.params.id;
   guestModel.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then(({ deletedCount }) => {
      if (deletedCount == 1) {
         res.redirect("/guestindex/guestlist");
      } else {
         res.send({
            message: `Cannot delete with id=${id}. Maybe DATA was not found!`
         });
      }
   })
      .catch(err => {
         res.status(500).send({
            message: "Could not delete this with id=" + id
         });
      })
};

const editGuestForm = (req, res) => {
   const id = req.params.id;
   guestModel.findOne({ _id: id })
      .then(async (data) => {
         if (data) {
            let payload = data;
            payload['title'] = "edit";
            payload['id'] = data._id;
            payload['guest'] = data;
            payload['events'] = await eventModel.find().then(data => data);
            res.render('guest', payload);
         } else {
            res.status(404).send({
               message: `Cannot find Customer with id=${id}.`
            });
         }
      })
      .catch(err => {
         console.log(err)
         res.status(500).send({
            message: "Error while Customer with id=" + id
         });
      });
}

const editGuest = async (req, res) => {
   let id = req.params.id;
   const { guest_name, contact, email } = req.body;
   let file_name = req.file.filename;
   const newGuest = { guest_name, contact, email, file_name }

   newGuest.image = file_name;
   guestModel
      .updateOne({ _id: mongoose.Types.ObjectId(id) }, newGuest)
      .then((data) => {


         res.redirect("/guestindex/guestlist")
      })
}

const guestDetails = (req, res) => {
   id = req.params.id
   console.log(id)
   eventModel
      .find()
      .then(async (data) => {
         let eventData = await eventModel.find({ "guests.guest": id, "guests.isConfirmed": "yes" })
         let payload = { data, eventData: eventData };
         res.render("guestDetails", payload);
      })
      .catch((err) => {
         res.status(500).send({
            message: err.message || "Some error occurred while retrieving data.",
         });
      });
}


const deleteEvent = async (req, res) => {
   console.log("Delete");
   let id = req.params.id;
   let guest_id = req.params.guest;
   console.log(id, guest_id);
   await eventModel.updateOne({ _id: id }, { $pull: { guests: { guest: guest_id } } });
   res.redirect("/guestIndex/guestlist");
}

module.exports = {
   save,
   guestlist,
   deleteGuest,
   editGuestForm,
   editGuest,
   guestDetails,
   deleteEvent,
};