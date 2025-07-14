import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
export const commonFieldsPlugin = (schema, options = {}) => {
  schema.add({
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    isCompletlyDelete: { type: Boolean, default: false },
    createdBy: { type: ObjectId, ref: 'admin', default: null },
    updatedBy: { type: ObjectId, default: null },
  })

  schema.add({})

  schema.query.notDeleted = function () {
    return this.where({ isDelete: false })
  }

  schema.methods.softDelete = async function () {
    this.isDelete = true
    return await this.save()
  }
  schema.methods.notArchive = async function () {
    this.archive = false
    return await this.save()
  }
}
