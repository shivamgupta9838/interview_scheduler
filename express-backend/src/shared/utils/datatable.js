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

const buildSearchFilter = async (
    model,
    search,
    fields = []
) => {
    if (!search || !fields.length) {
        return {};
    }

    const conditions = await Promise.all(
        fields.map(async (field) => {
            const referenceCondition =
                await buildReferenceSearchCondition(
                    model,
                    field,
                    search
                );

            if (referenceCondition) {
                return referenceCondition;
            }

            return {
                [field]: {
                    $regex: escapeRegex(search),
                    $options: "i",
                },
            };
        })
    );

    return {
        $or: conditions,
    };
};

const buildReferenceSearchCondition = async (
    rootModel,
    field,
    search
) => {
    const parts = field.split(".");

    let currentModel = rootModel;

    const references = [];

    let leafField = null;
    let leafModel = null;

    for (let index = 0; index < parts.length; index++) {
        const part = parts[index];

        const schemaPath = currentModel.schema.path(part);

        if (!schemaPath) {
            return null;
        }

        let ref = schemaPath.options?.ref;

        if (!ref && schemaPath.caster) {
            ref = schemaPath.caster.options?.ref;
        }

        if (!ref && Array.isArray(schemaPath.options?.type)) {
            ref = schemaPath.options.type[0]?.ref;
        }

        if (ref) {
            const referencedModel =
                currentModel.db.model(ref);

            references.push({
                model: currentModel,
                field: part,
                refModel: referencedModel,
            });

            currentModel = referencedModel;

            continue;
        }

        if (index === parts.length - 1) {
            leafField = part;
            leafModel = currentModel;
            break;
        }

        return null;
    }

    if (!references.length) {
        return null;
    }

    if (!leafField || !leafModel) {
        return null;
    }

    const matchingLeafDocuments = await leafModel
        .find({
            [leafField]: {
                $regex: escapeRegex(search),
                $options: "i",
            },
        })
        .select("_id")
        .lean();

    let matchingIds = matchingLeafDocuments.map(
        (document) => document._id
    );

    if (!matchingIds.length) {
        return {
            _id: {
                $in: [],
            },
        };
    }

    for (
        let index = references.length - 1;
        index > 0;
        index--
    ) {
        const reference = references[index];

        const parentDocuments = await reference.model
            .find({
                [reference.field]: {
                    $in: matchingIds,
                },
            })
            .select("_id")
            .lean();

        matchingIds = parentDocuments.map(
            (document) => document._id
        );

        if (!matchingIds.length) {
            return {
                _id: {
                    $in: [],
                },
            };
        }
    }

    const rootReference = references[0];

    return {
        [rootReference.field]: {
            $in: matchingIds,
        },
    };
};

const escapeRegex = (value = "") => {
    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
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

    const searchFilter = await buildSearchFilter(
        model,
        search,
        searchFields
    );

    const finalFilter = {
        $and: [
            filter,
            ...(Object.keys(searchFilter).length
                ? [searchFilter]
                : []),
        ],
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