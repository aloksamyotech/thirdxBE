import Transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'
import Session from '../models/session.js';
import user from '../models/user.js';
import Case from '../models/cases.js';


export const getAllDonationTotal = async () => {

    const result = await Transaction.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
         _id: null,
          totalAmountPaid: { $sum: '$amountPaid' },
        },
      },
    ]);
    const total = result[0]?.totalAmountPaid || 0;
    return { totalDonation: total }

};

export const getAllSessionDelivered = async () => {

    const result = await Session.find({isDeleted:false})
    const totalSession =  result.length;
    return {totalSession}
    
};


export const getAllActiveServiceUser = async () => {
    const result = await user.find({role:"service_user", isDeleted: false})
    const totalUser=  result.length;
    return {totalUser}
};


export const getAllOpenCased = async () => {
     const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const cases = await Case.find({
      isArchive: false,
      caseOpened: { $lte: today },
      $or: [
        { caseClosed: null },
        { caseClosed: { $gte: today } }
      ]
    });

    const totalcase = cases.length;
    return {totalcase};
};



