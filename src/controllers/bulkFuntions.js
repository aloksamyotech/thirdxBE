import { statusCodes } from '../core/common/constant.js';
import * as bulkFuntions from '../services/bulkFuntions.js'

export const bulkSoftDelete = async (req, res) => {
    const { ids, entityType, isCompletlyDelete = false } = req?.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.noIdFound,
            errorCodes?.no_Id_Found
        )
    }
    if (!entityType) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.roleNotFound,
            errorCodes?.not_found
        )
    }
    const deletedData = await bulkFuntions.bulkSoftDelete({ ids, entityType, isCompletlyDelete });
    res.status(statusCodes?.ok).send(deletedData);
};
export const bulkSoftArchive = async (req, res) => {
    const { ids, entityType } = req?.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.noIdFound,
            errorCodes?.no_Id_Found
        )
    }
    if (!entityType) {
        throw new CustomError(
            statusCodes?.badRequest,
            Message?.roleNotFound,
            errorCodes?.not_found
        )
    }
    const archiveData = await bulkFuntions.bulkSoftArchive({ ids, entityType });
    res.status(statusCodes?.ok).send(archiveData);
};
