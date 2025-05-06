import * as configurationService from '../services/configuration.js'
import { statusCodes } from '../core/common/constant.js'

export const addConfiguration = async (req, res, next) => {
    const addConfiguration = await configurationService.addConfiguration(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(addConfiguration)
}

export const getAllConfiguration = async (req, res, next) => {
    const allConfiguration = await configurationService.getAllConfiguration(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(allConfiguration)
}
export const updateConfigurationStatus = async (req, res, next) => {
    const updateConfigurationStatus = await configurationService.updateConfigurationStatus(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(updateConfigurationStatus)
}
export const deleteConfiguration = async (req, res, next) => {
    const deleteConfiguration = await configurationService.deleteConfiguration(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(deleteConfiguration)
}
export const searchConfigurationName = async (req, res, next) => {
    const searchConfigurationName = await configurationService.searchConfigurationByName(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(searchConfigurationName)
}
export const filterByConfigurationType = async (req, res, next) => {
    const filterByConfigurationType = await configurationService.filterByConfigurationType(
        req,
        res,
        next
    )
    res.status(statusCodes?.ok).send(filterByConfigurationType)
}
