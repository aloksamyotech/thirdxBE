import * as duplicate from '../services/duplicate.js';
import {statusCodes } from '../core/common/constant.js'

export const getDuplicateUserPairs = async (req, res) => {
  const duplicateUserPairs = await duplicate.getDuplicate();
  res.status(statusCodes?.ok).send(duplicateUserPairs);
};