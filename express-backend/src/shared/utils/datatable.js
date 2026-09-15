const logger = require("../../logger");

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

const getPagination = (query) => {
    let page = parseInt(query.page, 10);
    let pageSize = parseInt(query.pageSize, 10);

    page = Number.isInteger(page) && page > 0 ? page : 1;

    pageSize =
        Number.isInteger(pageSize) && pageSize > 0
            ? Math.min(pageSize, 100)
            : 10;

    return {
        page,
        pageSize,
        skip: (page - 1) * pageSize,
    };
};


const getDatatableFilters = async ({
    model,
    query,
    searchFields = [],
    filter = {},
    populate = [],
}) => {
    const {
        page,
        pageSize,
        skip,
    } = getPagination(query);

    const {
        search = "",
        sortBy,
        sortOrder,
    } = query;

    const searchFilter = buildSearchFilter(
        search,
        searchFields
    );

    const finalFilter = {
        ...filter,
        ...searchFilter,
    };

    const sort = buildSort(sortBy, sortOrder);

    const dataQuery = model
        .find(finalFilter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize);

    if (populate.length) {
        dataQuery.populate(populate);
    }

    const [data, total] = await Promise.all([
        dataQuery.lean(),
        model.countDocuments(finalFilter),
    ]);

    return {
        data,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
};

module.exports = {
    getDatatableFilters,
};