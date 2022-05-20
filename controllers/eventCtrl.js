const eventModel = require("../models/eventModel");
const guestModel = require("../models/guestModel");
const mongoose = require("mongoose");
const moment = require("moment");
let sizeof = require('object-sizeof')
const date = Date();

const save = (req, res) => {
  const { event_name, description, date, venue } = req.body;
  let isValid = true;

  let error = [];
  if (event_name === "" || isNaN(event_name) === false) {
    isValid = false;
    error.push("Invalid name");
  }


  if (description === "" || isNaN(description) === false) {
    isValid = false;
    error.push("Invalid description");
  }


  if (date === "" || isNaN(date) === false) {
    isValid = false;
    error.push("Invalid date");
  }


  if (venue === "" || isNaN(venue) === false) {
    isValid = false;
    error.push("Invalid venue");
  }

  console.log("L4" + isValid);

  if (isValid) {
    const newEvent = { event_name, description, date, venue };
    console.log(newEvent);

    eventModel
      .create(newEvent)
      .then(async (data) => {
        await eventModel.findByIdAndUpdate(
          data._id,
          { $addToSet: { user: req.session.userId } },
          { new: true }
        );
      res.redirect("/list");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the DATA.",
        });
      });
  } else {
    let payload = {};
    payload["title"] = "Error";
    payload["error"] = error;

    payload = { ...req.body, ...payload };
    console.log(payload);
    res.render("index", payload);
  }
};

const list = (req, res) => {
  const title = req.query.title;
  var name = title ? { name: { [Op.like]: `%${title}%` } } : null;
  const response = [];

  eventModel
    .find({ user: req.session.userId })
    .populate("guests")
    .then(async (data) => {
      // console.log(sizeof(data))
      const a = {'a':123,'b':555,'c':777}
      const size = Buffer.byteLength(JSON.stringify(data))
      const kiloBytes = sizeof(data) / 1024;
      const megaBytes = kiloBytes / 1024;
      console.log("stringifyD------",size)
      console.log("kB", kiloBytes);
      console.log("mB", megaBytes);
      console.log("packgae------",sizeof(data))
      console.log(data)
      let payload = { title: "List", data: data };
     res.json( payload);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

// eventModel.find({ where: name })
//     .then(async (data) => {
//       for (const eachData of data) {
//          let allGuests = []
//         const guests = await guestModel.find({ event: eachData._id });
//          for (const eachGuest of guests) {
//           allGuests.push(eachGuest.guest_name)
//          }
//         eachData.guest_name = allGuests.join(',');
//         response.push(eachData)
//       }

const listAPI = (req, res) => {
  // const user = req.user;
  const title = req.body.title;
  console.log(title);
  var key = title ? { event_name: { $regex: ".*" + title + ".*" } } : {};
  const response = [];
  eventModel
    .find(key)
    .populate("guests")
    .then(async (data) => {
      console.log(sizeof(data))
      console.log(data)
    res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

const page = (req, res) => {
  var perPage = 2;
  pageNo = req.body.page1;

  guestModel
    .find()
    .limit(perPage)
    .skip(perPage * pageNo)
    .then((data) => {
      res.json(data);
    });
};

// const page = (req, res) => {
//   eventModel.find().limit(3).skip(1)
//     .then(async (data) => {
//       res.json(data)
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving data."
//       });
//     });
// };
const sorting = (req, res) => {
  var pipeline = [
    { $sort: { event_name: 1 } },
    { $limit: 2 },
    // {$group: {_id: "$event_name"}}
  ];
  eventModel
    .aggregate(pipeline)
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
// const sorting = (req, res) => {
//   eventModel.find().sort(req.body)
//     .then(async (data) => {
//       res.json(data)
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving data."
//       });
//     });
// };

const filter = (req, res) => {
  // let query = {}
  // if(req.body.event_name != undefined && req.body.event_name !=""){
  //   query.event_name = req.body.event_name
  // }
  // if(req.body.venue != undefined && req.body.venue !=""){
  //   query.venue = req.body.venue
  // }
  eventModel
    .find(req.body)
    .then(async (data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

const editEventForm = (req, res) => {
  const id = req.params.id;
  eventModel
    .findOne({ _id: mongoose.Types.ObjectId(id) })
    .then((data) => {
      if (data) {
        let payload = data;
        payload["title"] = "edit";
        payload["id"] = data._id;
        console.log(data.date);
        payload["olddate"] = moment(data.date).format("YYYY-MM-DD");
        console.log(payload.date);
        res.render("index", payload);
      } else {
        res.status(404).send({
          message: `Cannot find Customer with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error while Customer with id=" + id,
      });
    });
};

const editEvent = (req, res) => {
  let id = req.params.id;
  console.log(">>>>>>>>",id)
  const input = req.body;
  // console.log(req.body.id);
  console.log(">>>>>>>>",input)

  eventModel
    .updateOne({ _id: mongoose.Types.ObjectId(id) }, input)
    .then((data) => {
      console.log(data);
      // let payload = {};
      // payload['title'] = "edit";
      // //payload['_id'] = _id;
      // payload['date'] = date;
      // payload = { ...req.body, ...payload };
      // console.log(payload)
      // console.log(req.body);
     
      
      res.redirect("/listAPI");
      

      
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

const deleteEvent = (req, res) => {
  const id = req.params.id;
  eventModel
    .deleteOne({ _id: mongoose.Types.ObjectId(id) })
    .then(({ deletedCount }) => {
      console.log(deletedCount);
      if (deletedCount == 1) {
        res.redirect("/list");
      } else {
        res.send({
          message: `Cannot delete with id=${id}. Maybe DATA was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete this with id=" + id,
      });
    });
};

const mailer = async (req, res) => {
  const event_Data = await eventModel.findById(req.body.event);
  const guest_data = await guestModel.findById(req.body.guest);
  const nodemailer = require("nodemailer");
  async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let data_Id = event_Data._id;
    let guest_Id = guest_data._id;
    let guest_email = guest_data.email;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: `"${guest_email}","bar@example.com"`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: `<p>Please Confirm the invitation by going to the followed link:
      <a href="http://localhost:3000/mailer/${data_Id}/${guest_Id}"`, // plain text body
      html: `<p>Please Confirm the invitation by going to the followed link:
      <a href="http://localhost:3000/mailer/${data_Id}/${guest_Id}">Yes</a> or <a href="http://localhost:3000/not/${data_Id}/${guest_Id}">No</a></p>`, // html body
    });

    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.redirect("/list");
  }
  main().catch(console.error);
};

const status = async (req, res) => {
  const event_id = req.params.id;
  const guest_id = req.params.guest_Id;
  // await eventModel.updateMany({},{$pull: {guests: guest_id}});

  await eventModel.findByIdAndUpdate(
    event_id,
    { $addToSet: { guests: { guest: guest_id, isConfirmed: "yes" } } },
    { new: true }
  );
  // await guestModel.findByIdAndUpdate(guest_id,{status: "Attending"})
  res.redirect("/guestIndex/guestlist");
};

const cancel = async (req, res) => {
  const event_id = req.params.id;
  const guest_id = req.params.guest_Id;
  await eventModel.findByIdAndUpdate(event_id,
    { $addToSet: { guests: { guest: guest_id, isConfirmed: "no" } } },
    { new: true });
  // await guestModel.findByIdAndUpdate(guest_id,{status: "Not Attending"})
  res.redirect("/guestIndex/guestlist");
};

const event_details = (req, res) => {
  id = req.params.id;
  eventModel
    .find()
    .then(async(data) => {
      let dataAttending = await eventModel.countDocuments({
        "_id":id,"guests.isConfirmed": "yes"
      });
      let notAttending = await eventModel.countDocuments({
        "_id":id,"guests.isConfirmed": "no"
      });
      let dataPending = await eventModel.countDocuments({
        "_id":id,"guests.isConfirmed": "pending"
      });
      let guestData = await eventModel.find({_id:id}).populate("guests.guest");
      console.log(guestData[0]._id)

      let payload = { data, dataAttending, notAttending, dataPending, guestData: guestData[0].guests };
      res.render("eventDetails", payload);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

const deleteGuest = async(req, res) => {
  console.log("Delete");
  let id = req.params.id;
  let guest_id = req.params.guest;
  console.log(id, guest_id);
  await eventModel.updateOne({_id: id},{$pull: { guests: { guest: guest_id}}});
  res.redirect("/list");
}

module.exports = {
  save,
  list,
  deleteEvent,
  editEventForm,
  editEvent,
  listAPI,
  page,
  sorting,
  filter,
  mailer,
  status,
  cancel,
  event_details,
  deleteGuest
};

// const save = (req, res) => {
//   console.log(req.body)
//   let data =  new guestModel(req.body);
//   console.log(req.body)

//   data.save(function (err, data) {
//      console.log(data)
//      if (err)
//         res.send(err);
//      else
//         res.send({ status: 200, message: "Data added succesfully", Obj: data });

//   });

//   if data {
//      const newGuest = { guest_name, contact, event_name }
//      console.log(newGuest);
//      dataModel.create(newEvent)
//        .then(data => {
//          res.redirect("/");
//        })
//        .catch(err => {
//          res.status(500).send({
//            message:
//              err.message || "Some error occurred while creating the DATA."
//          });
//        });
//    }
//    else {
//      let payload = {};
//      payload['title'] = "Error";
//      payload['error'] = error;
//      payload = { ...req.body, ...payload };
//      console.log(payload)
//      res.render('index', payload);
//    };
// };
