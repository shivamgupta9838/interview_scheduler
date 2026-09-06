const buildSort = (sortBy, sortOrder = "asc") => {
    if (!sortBy) {
        return {
            createdAt: -1,
        };
    }

    return {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };
};

const buildSearchFilter = (search, fields = []) => {
    if (!search || !fields.length) {
        return {};
    }

    return {
        $or: fields.map((field) => ({
            [field]: {
                $regex: search,
                $options: "i",
            },
        })),
    };
};

module.exports = {
    buildSort,
    buildSearchFilter,
};