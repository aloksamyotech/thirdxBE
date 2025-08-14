import * as ListService from '../services/list.js'
import { statusCodes } from '../core/common/constant.js'

export const addList = async (req, res) => {
  const data = req?.body || {}
  const addList = await ListService.addList(data)
  res.status(statusCodes?.ok).send(addList)
}

export const getAllList = async (req, res) => {
  const allList = await ListService.getAllList()
  res.status(statusCodes?.ok).send(allList)
}

export const getListWithPagination = async (req, res) => {
  const searchData = await ListService.getListWithPagination(req?.query)
  res.status(statusCodes?.ok).send(searchData)
}
export const getListDetailById = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10)|| 10 ;

  const allList = await ListService.getListDetailById(id, page, limit);
  res.status(statusCodes?.ok).send(allList)
}
export const AddBulkTagController = async (req, res) => {
  const result = await ListService.assignTagToEntities(req.body)

  if (result instanceof Error) {
    return res.status(result.statusCode).json({
      success: false,
      message: result.message
    })
  }

  return res.status(200).json({
    success: true,
    ...result
  })
}
