import User from '../models/user.js';
import {
  checkRole,
} from '../core/common/constant.js'
export const getDuplicate = async () => {
  const duplicates = await User.aggregate([
    {
      $match: {
        isDelete: false,
        role: checkRole.service_user,
        "contactInfo.email": { $ne: null, $ne: "", $exists: true },
        "personalInfo.firstName": { $ne: null, $ne: "", $exists: true },
        "personalInfo.lastName": { $ne: null, $ne: "", $exists: true },
        "personalInfo.dateOfBirth": { $ne: null, $ne: "", $exists: true }
      }
    },
    {
      $group: {
        _id: {
          email: "$contactInfo.email",
          firstName: { $trim: { input: "$personalInfo.firstName" } },
          lastName: { $trim: { input: "$personalInfo.lastName" } },
          dob: "$personalInfo.dateOfBirth"
        },
        users: { $push: "$$ROOT" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
        count: { $gt: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        email: "$_id.email",
        firstName: "$_id.firstName",
        lastName: "$_id.lastName",
        dob: "$_id.dob",
        users: 1
      }
    }
  ]);

  return duplicates;
};
