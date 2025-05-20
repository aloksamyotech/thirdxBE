import * as configurationService from '../services/configuration.js'
import { statusCodes } from '../core/common/constant.js'

export const addConfiguration = async (req, res) => {
  const { name, isActive, configurationType } = req?.body || {}
  const configData = {
    name,
    isActive,
    configurationType,
  }
  const addConfiguration =
    await configurationService.addConfiguration(configData)
  res.status(statusCodes?.ok).send(addConfiguration)
}

export const updatedConfiguration = async (req, res) => {
  const { configId } = req?.params || {}
  const { name, isActive, configurationType } = req?.body || {}
  const configData = {
    name,
    isActive,
    configurationType,
  }
  const updateDataConfiguration =
    await configurationService.updateConfiguration(configId, configData)
  res.status(statusCodes?.ok).send(updateDataConfiguration)
}

export const getAllConfiguration = async (req, res) => {
  const allConfiguration = await configurationService.getAllConfiguration()
  res.status(statusCodes?.ok).send(allConfiguration)
}

export const updateConfigurationStatus = async (req, res) => {
  const { configId } = req?.params || {}
  const { isActive } = req?.body || {}

  const updateConfigurationStatus =
    await configurationService.updateConfigurationStatus(configId, isActive)
  res.status(statusCodes?.ok).send(updateConfigurationStatus)
}

export const deleteConfiguration = async (req, res) => {
  const { configId } = req?.params || {}
  const deleteConfiguration =
    await configurationService.deleteConfiguration(configId)
  res.status(statusCodes?.ok).send(deleteConfiguration)
}

export const searchConfigurationName = async (req, res) => {
  const { name } = req?.query || {}
  const searchConfigurationName =
    await configurationService.searchConfigurationByName(name)
  res.status(statusCodes?.ok).send(searchConfigurationName)
}

export const filter = async (req, res) => {
  const { type, status } = req?.query || {}
  const filter = await configurationService.filter(type, status)
  res.status(statusCodes?.ok).send(filter)
}

export const getConfigurationWithPagination = async (req, res) => {
  const searchData = await configurationService.getConfigurationWithPagination(
    req?.query
  )
  res.status(statusCodes?.ok).send(searchData)
}
