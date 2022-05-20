const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = mongoose.Schema({
  event_name: String,
  description: String,
  date: Date,
  venue: String,
  guests: [
    {
      guest: { type: Schema.Types.ObjectId, ref: "guest" },
      isConfirmed: {
        type: String,
        enum: ["yes", "no", "pending"],default:"pending",
      },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: "users" },
});

var eventModel = mongoose.model("events", eventSchema);

module.exports = eventModel;
