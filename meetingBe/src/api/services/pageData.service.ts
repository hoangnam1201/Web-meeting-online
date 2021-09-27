export default class PageDataService {
    static getPageData(docs: any[], count: number, pageIndex: number, limit: number): PageData {
        const totalPage = count === limit ? 1 : Math.round((count / limit) + 0.5);

        const hasPrevPage = 0 < pageIndex;
        const hasNextPage = (totalPage - 1) > pageIndex;
        const pageSize = limit;
        const pageData: PageData = {
            currentPageIndex: pageIndex,
            docCount: count,
            hasNextPage,
            hasPrevPage,
            pageSize,
            totalPage,
            docs
        }
        return pageData;
    };
}

export interface PageData {
    currentPageIndex: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    pageSize: number,
    totalPage: number,
    docCount: number,
    docs: any[],
}