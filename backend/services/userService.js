import User from "../models/User.js";

export const createUser = async (data) => {
  return User.create(data);
};

export const findUserByEmail = (email) => {
  return User.findOne({ email });
};

export const findUserById = (id) => {
  return User.findById(id);
};
