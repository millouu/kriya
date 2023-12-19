import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/enroll", (req, res) => {
  const { name, dob, mobile, selectedBatch, gender } = req.body;

  // Validation logic
  const nameRegex = /^[a-zA-Z\s]+$/;
  const validName = nameRegex.test(name);
  const currentDate = new Date();
  const userDOB = new Date(dob);
  const age = currentDate.getFullYear() - userDOB.getFullYear();
  const isValidDOB = age >= 18 && age <= 65;

  if (!name || !validName || !dob || !isValidDOB || !mobile || mobile.length !== 10 || !selectedBatch || !gender) {
    return res.status(400).json({ error: "Invalid form data. Please check your entries." });
  }

  // If validation passes, send a success response with the submitted data
  const enrolledUserData = {
    name,
    dob,
    mobile,
    selectedBatch,
    gender,
  };

  res.status(200).json({
    message: "Successfully Enrolled!",
    userData: enrolledUserData,
  });
});

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
