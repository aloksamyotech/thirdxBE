export const commonFieldsPlugin = (schema, options = {}) => {
    schema.add({
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
    });

    schema.query.notDeleted = function () {
        return this.where({ isDeleted: false });
    };

    schema.methods.softDelete = async function () {
        this.isDeleted = true;
        return await this.save();
    };
    schema.methods.notArchive = async function () {
        this.archive = false;
        return await this.save();
    };
};
