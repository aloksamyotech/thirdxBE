/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import user from '../models/user.js';
import { errorCodes, Message, statusCodes } from '../core/common/constant.js';
import CustomError from '../utils/exception.js';
import axios from 'axios';

export const addUser = async (req) => {
  const userData = req?.body || {}
  const filePath = req?.file?.path

  if (filePath) {
    userData.otherInfo = {}
    userData.otherInfo.file = `uploads/${filePath}`
  }

  const newUser = await user.create(userData)
  if (!newUser) {
    return new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
  return { newUser }
}

export const getAllUser = async () => {
  const allUser = await user.find({ isDeleted: false, role: 'service_user' }).sort({ createdAt: -1 })
  if (!allUser) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allUser }
}

export const getAllVolunteer = async () => {
  const allVolunteer = await user.find({ isDeleted: false, role: 'volunteer' }).sort({ createdAt: -1 })
  if (!allVolunteer) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allVolunteer }
}

export const getAllDonor = async () => {
  const allDonor = await user.find({ isDeleted: false, role: 'donor' }).sort({ createdAt: -1 })
  if (!allDonor) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }
  return { allDonor }
}

export const getUserById = async (req) => {
  const { userId } = req?.params || {}

  if (!userId) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.notFound,
      errorCodes?.not_found
    )
  }

  const userData = await user.findOne({ _id: userId, isDeleted: false })
  if (!userData) {
    throw new CustomError(
      statusCodes?.notFound,
      Message?.userNotGet,
      errorCodes?.user_not_found
    )
  }
  return userData
}

export const getAllUsDistricts = async (req) => {
  const response = await axios.get('https://api.census.gov/data/2020/dec/pl?get=NAME&for=place:*&in=state:*');

  // Process the data
  const [headers, ...rows] = response.data;

  const cityStateArray = rows.map(row => {
    const [placeWithState] = row;
    const city = placeWithState.split(',')[0]
      .replace(/\s(city|town|CDP)$/i, '')
      .trim();
    const state = placeWithState.split(',')[1]
      .replace(/\s+$/, '')
      .trim();

    return `${city}, ${state}`;
  });

  return {
    cities: cityStateArray
  };
}
