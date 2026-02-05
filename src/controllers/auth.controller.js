const wrapAsync = require("../utils/wrapAsync.util");
const {
  registerUserService,
  loginUserService,
  generateToken
} = require("../services/auth.service");

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

module.exports.registerUser = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUserService(
    name.firstName,
    name.lastName,
    email,
    password
  );

  return res.status(201).json({
    message: "User Registered Successfully",
    user: {
      _id: user._id,
      name: {
        firstName: user.name.firstName,
        lastName: user.name.lastName
      },
      email: user.email
    }
  });
});

module.exports.loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await loginUserService(email, password);
  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "None" : "Lax", // cross-site cookie support
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({
    message: "Login Successful",
    user: {
      _id: user._id,
      name: {
        firstName: user.name.firstName,
        lastName: user.name.lastName
      },
      email: user.email
    }
  });
});

module.exports.aboutMe = (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  return res.status(200).json({ message: "Logout Successful" });
};
