import Transaction from '../models/transaction.js'
import { errorCodes, Message, statusCodes } from '../core/common/constant.js'
import CustomError from '../utils/exception.js'
import { regexFilter } from '../core/common/common.js'



export const getAllDonationTotal = async () => {

    const result = await Transaction.aggregate([
      { $match: { isArchive: false } },
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

