const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const app = express()
const port = 3000;
const cors = require("cors")

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const User = require("./models/user")

mongoose.connect("mongodb+srv://giojsph:giojsph0715@cluster0.dmm6j.mongodb.net/").then(() => {
  console.log("Connected to  MongoDB")

}).catch((error) => {
  console.log("Error connecting to MongoDB")
})

app.listen(port, () => {
  console.log("Server is Running on 3000")
})

//endpoint to register a user to backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password
    });
    // generate a verification Token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the backend
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
    //send the verification email to the registered User
    sendVerificationEmail(newUser.email, newUser.verificationToken)
  } catch (error) {
    console.log("Error registering the user");
    res.status(500).json({ message: "Registration failed" });
  }

})


const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "cahiles.giojoseph@gmail.com",
      pass: "jwlb ntdq uokg guda",
    }
  })

  const mailOptions = {
    from: "http://localhost:8081",
    to: email,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email: http://localhost:3000/verify/${verificationToken}`,
  };

  //send the mail
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending the verification Email")
  }
};

//verify the user
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verificaiton token" })
    }

    //mark the user as verified
    user.verified = true
    user.verificationToken = undefined
    await user.save();
    res.status(200).json({ message: "Email verified successfully." })

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Email verification failed" })
  }

})

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey
};

const secretKey = generateSecretKey();

//endpoint to login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or passowrd" });
    }
    //check in password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user.id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "login failed" });
  }

});

//endpoint to change or select the gender for a particular user profile
app.put("/users/:userId/gender", async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { gender: gender },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({ message: "User gender updated Succcesfully" })
  } catch (error) {
    res.status(500).json({ message: "Error updating user gender", error });
  }

});

//endpoints to update the user's description

app.put("/users/:userId/description", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        description: description,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    };
    return res.status(200).json({ message: "User description updated succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user description" });
  }

});

//fetch user's data
app.get("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the user details" });
  }

});


//endpoint to add a preferences for a use in the backend
app.put("/users/:userId/preferences/add", async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { preferences: preferences } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Preference updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding the preferences" });
  }
});

//endpoint to remove a particular preference for the user
app.put("/users/:userId/preferences/remove", async (req, res) => {
  try {
    const { userId } = req.params;

    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { preferences: preferences } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Preference removed successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Error removing preference" });
  }
});

//endpoint to add a lookingFor for a user in the backend
app.put("/users/:userId/looking-for", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { lookingFor: lookingFor },

      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" })
    }

    return res.status(200).json({ message: "Looking for updated successfully", user })
  } catch (error) {
    res.status(500).json({ mesage: "Error updating looking for", error });
  }
});

//endpoint to remove looking for in the backend
app.put("/users/:userId/looking-for/remove", async (req, res) => {
  try {
    const { userId } = req.params;
    const { lookingFor } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { lookingFor: lookingFor },

      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "No user" })
    }

    return res.status(200).json({ message: "Looking for updated successfully".user })
  } catch (error) {
    res.status(500).json({ message: "Error removing looking for", error })
  }
});

app.post("/users/:userId/profile-images", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    user.profileImages.push(imageUrl);

    await user.save();

    return res.status(200).json({ message: "Image has been added", user })

  } catch (error) {
    res.status(500).json({ message: "Error adding the profile image" })
  }
});

//endpoint to fetch all the profiles for the particular user

app.get("/profiles", async (req, res) => {
  try {
    const { userId, gender, preferences, lookingFor } = req.query;

    let filter = {};

    // If a gender is selected, allow the user to see profiles of other genders as well
    if (gender) {
      // Allow the selected gender but don't filter out others
      filter.$or = [
        { gender: gender },  // Show profiles of the selected gender
        { gender: { $ne: gender } } // Show profiles of other genders
      ]
    };

    if (preferences) {
      filter.lookingFor = { $in: preferences };
    }

    if (lookingFor) {
      filter.lookingFor = { $in: lookingFor };
    }

    const currentUSer = await User.findById(userId)
      .populate("matches", "_id")
      .populate("liked", "_id");

    //extract the ID's of the matches
    const friendIds = currentUSer.matches.map((friend) => friend._id);

    const likeIds = currentUSer.liked.map((like) => like._id);

    const profiles = await User.find(filter)
      .where("_id")
      .nin([userId, ...friendIds, ...likeIds]);

    return res.status(200).json({ profiles })
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profiles", error });
  }

});


app.post("/send-like", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //update the recipients receivedLikes 
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { receivedLikes: currentUserId }
    })
    await User.findByIdAndUpdate(currentUserId, {
      $push: { liked: selectedUserId }
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Error sending a like", error })
  }

})

//endpoint to get the details of the received likes
app.get("/received-likes/:userId/details", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    };
    //fetch the details of the users who liked the current user
    const receivedLikesArray = [];
    for (const likedUserId of user.receivedLikes) {
      const likedUser = await User.findById(likedUserId)
      if (likedUser) {
        receivedLikesArray.push(likedUser)
      }
    };

    res.status(200).json({ receivedLikesArray });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the details", error })
  }
});

//endpoint to create a match between 2 people
app.post("/create-match", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    //update the selected user's liked array and the matches array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { matches: currentUserId },
      $pull: { liked: currentUserId }
    });

    //update the current user's matches array receivedLikes array
    await User.findByIdAndUpdate(currentUserId,{
      $push: {matches:selectedUserId},
      $push: {receivedLikes:selectedUserId}
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Erro create a match", error })
  }
});

//endpoint to get all the matches of a user
app.get("/users/:userId/matches", async(req,res) => {
    try{
        const {userId} = req.params;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"User not found"})
        };
        const matchIds= user.matches;

        const matches = await User.find({_id : {$in:matchIds}});

        res.status(200).json({matches})
    }catch(error){
      res.status(500).json({message:"Error retrieving the matches", error})
    }
});