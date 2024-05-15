const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userData) => {
  try {
    const user = new User({
        ...userData
    });
    return user.save();
  } catch (error) {
    console.log(error, "it's error in create user functions!");
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, attributes, req) => {
  const users = await User.findAll({
    where: filter,
    attributes
  });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findByPk(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  try {
    return await User.findOne({
      where: {
        email
      }
    });
  } catch (error) {
    console.log(error, "it's error in get user by email functions!");    
  }
};

/**
 * Update user by id
 * @param {ObjectId} user_id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (user_id, data) => {
  const user = await getUserById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }
  user = {...user,...data}
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} user_id
 * @returns {Promise<User>}
 */
const deleteUserById = async (user_id) => {
  const user = await getUserById(user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};



module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};