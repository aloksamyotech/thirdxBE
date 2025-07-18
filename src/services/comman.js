import tagCategory from '../models/tagCategory.js'
import tag from '../models/tags.js'

export const findTagWithCategory = async (appliedToValue) => {

    const filteredCategories = await tagCategory.find({
        appliedTo: appliedToValue,
        isActive: true,
        isDelete: false,
        isCompletlyDelete: false
    });
    const categoryIds = filteredCategories.map(cat => cat._id);
    const relatedTags = await tag.find({
        tagCategoryId: { $in: categoryIds },
        isActive: true,
        isDelete: false,
        isCompletlyDelete: false
    });
    const mergedData = filteredCategories.map(category => {
        const tags = relatedTags.filter(
            tagItem => tagItem.tagCategoryId.toString() === category._id.toString()
        );
        return {
            ...category.toObject(),
            tags
        };
    });
    return mergedData


};