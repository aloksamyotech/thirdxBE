
import { statusCodes } from '../core/common/constant.js';
import { modelMap } from "../core/helpers/modelMap.js"
export const bulkSoftDelete = async ({ ids, entityType, isCompletlyDelete = false }) => {

    const Model = modelMap[entityType];
    if (!Model) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.roleNotFound,
            errorCodes?.roleNotFound
        )
    }
    const updateFields = isCompletlyDelete
        ? { isCompletlyDelete: true }
        : { isDelete: true };




    const deletedData = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: updateFields }
    );
    return { deletedData }
};

export const bulkSoftArchive = async ({ ids, entityType }) => {
    const Model = modelMap[entityType];
    if (!Model) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.roleNotFound,
            errorCodes?.roleNotFound
        )
    }
    const archivedData = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { isArchive: true } }
    );
    return { archivedData }
};
