import * as tagService from '../services/tag.js'
import { statusCodes } from '../core/common/constant.js'

export const addTags = async (req, res) => {
  const data = req?.body || {}
  const addTags = await tagService.addTags(data)
  res.status(statusCodes?.ok).send(addTags)
}

export const getAllTags = async (req, res) => {
  const alltags = await tagService.getAllTags()
  res.status(statusCodes?.ok).send(alltags)
}

export const updateTagStatus = async (req, res) => {
  const { tagId } = req?.params || {}
  const { isActive } = req?.body || {}
  const updateTagStatus = await tagService.updateTagStatus(tagId, isActive)
  res.status(statusCodes?.ok).send(updateTagStatus)
}

export const filter = async (req, res) => {
  const { name, status } = req?.query || {}
  const filter = await tagService.filter(name, status)
  res.status(statusCodes?.ok).send(filter)
}

export const editTags = async (req, res) => {
  const { tagId } = req?.params || {}

  const { tagCategoryName, name, startDate, endDate, note } = req.body

  const tagData = {
    tagCategoryName,
    name,
    startDate,
    endDate,
    note,
  }

  const editTags = await tagService.editTags(tagId, tagData)
  res.status(statusCodes?.ok).send(editTags)
}

export const deleteTags = async (req, res) => {
  const { tagId } = req?.params || {}
  const deleteTags = await tagService.deleteTags(tagId)
  res.status(statusCodes?.ok).send(deleteTags)
}

export const getTagwithPagination = async (req, res) => {
  const searchData = await tagService.getTagwithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
