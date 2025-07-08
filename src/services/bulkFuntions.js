import Case from "../models/cases.js";
import Services from "../models/services.js";
import user from "../models/user.js";

export const bulkSoftDelete = async ({ ids, entityType }) => {
    const modelMap = {
        service_user: user,
        cases: Case,
        services: Services,
        volunteer: user
    };
    const Model = modelMap[entityType];
    if (!Model) {
        throw new CustomError(
            statusCodes?.notFound,
            Message?.roleNotFound,
            errorCodes?.roleNotFound
        )
    }
    const deletedData = await Model.updateMany(
        { _id: { $in: ids } },
        { $set: { isDelete: true } }
    );
    return { deletedData }
};

export const bulkSoftArchive = async ({ ids, entityType }) => {
    const modelMap = {
        service_user: user,
        cases: Case,
        services: Services,
        volunteer: user
    };
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