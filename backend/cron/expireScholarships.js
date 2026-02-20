// cron/expireScholarships.js
const cron = require("node-cron");
const Scholarship = require("../models/Scholarship");

cron.schedule("0 0 * * *", async () => {
  await Scholarship.updateMany(
    { deadline: { $lt: new Date() } },
    { status: "expired" }
  );
  console.log("Expired scholarships updated");
});
