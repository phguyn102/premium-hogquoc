const { model, Schema } = require("mongoose");

let warningSchema = new Schema({
    GuildID: String,
    UserID: String,
    Usertag: String,
    Content: Array
});

module.exports = model("Warn", warningSchema);