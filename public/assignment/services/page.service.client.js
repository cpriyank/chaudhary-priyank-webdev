// PageService in a file called page.service.client.js.
// The service is declared in a function of the same name. In the service
// there's a local array called pages that will be used to simulate data from
// a database. The local pages array is only temporary and will be removed in
// the next assignment where data will be fetched from the server
(function(){
    angular
        .module("WebAppMaker")
        .factory('PageService', PageService);
    function PageService(){
		// data to initialize the pages array
        var pages = [
            { "_id": "321", "name": "Post 1", "title": "Post XXX", "websiteId": "567" },
            { "_id": "432", "name": "Post 2", "title": "SA 2", "websiteId": "567" },
            { "_id": "543", "name": "Post 3", "title": "XX 3", "websiteId": "567" }
        ];

// API in the PageService service
        var api = {
            'createPage' : createPage,
            'findPageByWebsiteId' : findPageByWebsiteId,
            'findPageById' : findPageById,
            'updatePage' : updatePage,
            'deletePage' : deletePage,
            'deletePagesByWebsite' : deletePagesByWebsite
        };
        return api;

        function getNextId() {
            function getMaxId(maxId, currentId) {
                var current = parseInt(currentId._id);
                if (maxId > current) {
                    return maxId;
                } else {
                    return current + 1;
                }
            }
            return pages.reduce(getMaxId, 0).toString();
        }

// createPage(websiteId, page) - adds the page parameter instance to the local
			// pages array. The new page's websiteId is set to the websiteId parameter
        function createPage(websiteId, page){
            var newPageId = getNextId();
            var newPage = {
                _id: newPageId,
                name: page.name,
                title: page.title,
                websiteId: websiteId
            };
            pages.push(newPage);
        }

// findPageByWebsiteId(websiteId) - retrieves the pages in local pages array
			// whose websiteId matches the parameter websiteId
        function findPageByWebsiteId(websiteId) {
            var result = [];
            function filterByWebsiteId(page){
                return page.websiteId === websiteId;
            }
            result = pages.filter(filterByWebsiteId);
            return result;
        }

// findPageById(pageId) - retrieves the page in local pages array whose _id
			// matches the pageId parameter
        function findPageById(pageId){
            for(p in pages){
                var page = pages[p];
                if(page._id == pageId){
                    return page;
                }
            }
            return null;
        }

// updatePage(pageId, page) - updates the page in local pages array whose _id
			// matches the pageId parameter
        function updatePage(pageId, page){
            var oldPage = findPageById(pageId);
            var index = pages.indexOf(oldPage);
            pages[index].name = page.name;
            pages[index].title = page.title;
        }

// deletePage(pageId) - removes the page from local pages array whose _id
			// matches the pageId parameter
        function deletePage(pageId) {
            var oldPage = findPageById(pageId);
            var index = pages.indexOf(oldPage);
            pages.splice(index, 1);
        }

        function deletePagesByWebsite(websiteId){
            for(p in pages){
                var page = pages[p];
                if(page.websiteId == websiteId){
                    deletePage(page._id);
                }
            }
        }
    }
})();
