"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageDataService {
    static getPageData(docs, count, pageIndex, take) {
        const totalPage = count === take ? 1 : Math.round((count / take) + 0.5);
        const hasPrevPage = 0 < pageIndex;
        const hasNextPage = (totalPage - 1) > pageIndex;
        const pageSize = take;
        const pageData = {
            currentPageIndex: pageIndex,
            docCount: count,
            hasNextPage,
            hasPrevPage,
            pageSize,
            totalPage,
            docs
        };
        return pageData;
    }
    ;
}
exports.default = PageDataService;
//# sourceMappingURL=pageData.service.js.map