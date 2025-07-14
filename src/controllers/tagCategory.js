import * as tagCategoryService from '../services/tagCategory.js'
import { statusCodes } from '../core/common/constant.js'

export const addTagCategory = async (req, res) => {
    const data = req?.body || {};
    const addTagCategory = await tagCategoryService.addTagCategory(data);
    res.status(statusCodes?.ok).send(addTagCategory);
}

export const getTagCategorywithPagination = async (req, res) => {
    const searchData = await tagCategoryService.getTagCategorywithPagination(req?.query);
    res.status(statusCodes?.ok).send(searchData);
}

export const updateTagStatus = async (req, res) => {
    const { tagId } = req?.params || {}
    const { isActive } = req?.body || {}
    const updateTagStatus = await tagCategoryService.updateTagStatus(tagId, isActive)
    res.status(statusCodes?.ok).send(updateTagStatus)
}

export const getbyId = async (req, res) => {
    const { id } = req?.params || {};
    const tagCategoryData = await tagCategoryService.getbyId(id);
    res.status(statusCodes?.ok).send(tagCategoryData)
}

export const editTagCategory = async (req, res) => {
    const { id } = req?.params || {}

    const { name, appliedTo, isActive } = req.body

    const data = {
        name,
        appliedTo,
        isActive
    }

    const response = await tagCategoryService.editTags(id, data);
    res.status(statusCodes?.ok).send(response)
}