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

module.exports = {
    getPagination,
};