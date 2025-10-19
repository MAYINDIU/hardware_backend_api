const userModel = require("../models/userModel");



exports.createUser = async (req, res) => {
  try {
    const userData = req.body;

    const result = await userModel.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({
      message: "Error creating user",
      error: err.message || "An unexpected error occurred",
    });
  }
};

// Get all users

exports.getAllUsers = async (req, res) => {
  try {
    const results = await userModel.getAllUsers();
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.getUserById(id);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user[0]); // return the first row
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userModel.updateUser(id, req.body);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  userModel.deleteUser(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting user", error: err });
    res.status(200).json({ message: "User deleted successfully" });
  });
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await userModel.loginUser(username, password);

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user: result[0]
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message
    });
  }
};
