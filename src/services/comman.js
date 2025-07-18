import tagCategory from '../models/tagCategory.js'
import tag from '../models/tags.js'

export const findTagWithCategory = async (appliedToValue) => {
    try {
        // Step 1: Fetch filtered categories
        const filteredCategories = await tagCategory.find({
            appliedTo: appliedToValue,
            isActive: true,
            isDelete: false,
            isCompletlyDelete: false
        });

        // Step 2: Get category IDs
        const categoryIds = filteredCategories.map(cat => cat._id);

        // Step 3: Fetch related tags
        const relatedTags = await tag.find({
            tagCategoryId: { $in: categoryIds },
            isActive: true,
            isDelete: false,
            isCompletlyDelete: false
        });

        // Step 4: Merge tags into their respective categories
        const mergedData = filteredCategories.map(category => {
            const tags = relatedTags.filter(
                tagItem => tagItem.tagCategoryId.toString() === category._id.toString()
            );

            // Add `tags` array into the category object
            return {
                ...category.toObject(), // convert Mongoose document to plain JS object
                tags
            };
        });

        // Step 5: Return the final structured response
        return {
            success: true,
            message: "Filtered categories with nested tags fetched successfully",
            data: mergedData
        };

    } catch (error) {
        console.error("Error in findTagWithCategory:", error);
        return {
            success: false,
            message: "Something went wrong",
            error
        };
    }
};