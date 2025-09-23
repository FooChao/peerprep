import UserModel from "./user-model.js";
import UserVerifyModel from "./user-verify-model.js";
import "dotenv/config";
import { connect } from "mongoose";

//#region util fns
export async function connectToDB() {
  let mongoDBUri =
    process.env.ENV === "PROD"
      ? process.env.DB_CLOUD_URI
      : process.env.DB_LOCAL_URI;

  await connect(mongoDBUri);
}
//#endregion

//#region User Model related fns
export async function createUser(username, email, password) {
  return new UserModel({ username, email, password }).save();
}

export async function findUserByEmail(email) {
  return UserModel.findOne({ email });
}

export async function findUserById(userId) {
  return UserModel.findById(userId);
}

export async function findUserByUsername(username) {
  return UserModel.findOne({ username });
}

export async function findUserByUsernameOrEmail(username, email) {
  return UserModel.findOne({
    $or: [
      { username },
      { email },
    ],
  });
}

// for stricter matching when needed such as when verifying email ownership
export async function findUserByUsernameAndEmail(username, email) {
  return UserModel.findOne({
    $and: [
      { username },
      { email },
    ],
  });
}

export async function findAllUsers() {
  return UserModel.find();
}

export async function updateUserById(userId, username, email, password) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        username,
        email,
        password,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function updateUserPrivilegeById(userId, isAdmin) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        isAdmin,
      },
    },
    { new: true },  // return the updated user
  );
}

export function updateUserVerificationStatusById(userId, verified) {
  return UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        verified,
      },
    },
    { new: true },  // return the updated user
  );
}

export async function deleteUserById(userId) {
  return UserModel.findByIdAndDelete(userId);
}
//#endregion

//#region User Verify Model related fns

export async function createUserVerifyRecord(userId, token) {
  return new UserVerifyModel({ userId, token }).save();
}

export async function findUserVerifyRecordByTokenAndId(token, userId) {
  return UserVerifyModel.findOne({ 
    $and: [
      { token },
      { userId },
    ],
  });
}

export async function deleteUserVerifyRecordByUserId(userId) {
  return UserVerifyModel.deleteMany({ userId });
}

//#endregion
