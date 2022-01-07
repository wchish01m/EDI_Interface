"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetURLService = void 0;
var SetURLService = /** @class */ (function () {
    function SetURLService(router) {
        this.router = router;
    }
    /**
     * This function is called in the service classes.
     * It is used to determine if a test environement is
     * being used or if the program is live. It will assign
     * the proper URL for API calls.
     * */
    SetURLService.prototype.getURL = function () {
        if (this.router.url.includes("edi")) {
            this.baseURL = 'http://edi_api/api';
        }
        else {
            this.baseURL = 'http://localhost:5000/api';
        }
        return this.baseURL;
    };
    return SetURLService;
}());
exports.SetURLService = SetURLService;
//# sourceMappingURL=setURL.service.js.map