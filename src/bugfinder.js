"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var puppeteer = require("puppeteer");
var request = require("request");
// 트렐로 정보 
var trello = {
    idList: '5cc69a5b1d138f81d45e4188',
    idLabels: '5ca486cd5cbe2c824836ec31',
    key: '5b6cdfa6cf36c0ffd91e542cdfa187bd',
    token: '0e0f637f865af876a7a2b256840973d5e6413302be0a11a1db5ab2ac730702f0'
};
// 페이지 정보
var urls = {
    sonarqube_page: 'http://13.209.176.175:9000/project/issues?id=CTIP_SMA_5&resolved=false&severities=MAJOR'
};
// 셀렉터 영역
var selectors = {
    wait_for_bugs: '#issues-page > div.layout-page-main > div.layout-page-main-inner > div > div > div:nth-child(1) > div.issues-workspace-list-component.note > div',
    bugs: '.issue'
};
// 리스트의 카드 전부 삭제
var delete_all_cards = function () {
    var options = {
        method: 'POST',
        url: 'https://api.trello.com/1/lists/' + trello.idList + '/archiveAllCards',
        qs: {
            key: trello.key,
            token: trello.token
        }
    };
    request(options, function (error, response, body) {
        if (error)
            throw new Error(error);
    });
};
// 카드 추가
var create_cards = function (bug_result) {
    for (var i = 0; i < bug_result.length; i++) {
        var options = { method: 'POST',
            url: 'https://api.trello.com/1/cards',
            qs: {
                name: bug_result[i].title,
                desc: bug_result[i].link,
                idList: trello.idList,
                idLabels: trello.idLabels,
                keepFromSource: 'all',
                key: trello.key,
                token: trello.token
            }
        };
        request(options, function (error, response, body) {
            if (error)
                throw new Error(error);
        });
    }
};
// 버그 가져오기
var get_bugs = function (page) { return __awaiter(_this, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                // 소나큐브 페이지 이동 (5초이상 로딩이면 에러발생)
                return [4 /*yield*/, page.goto(urls.sonarqube_page)];
            case 1:
                // 소나큐브 페이지 이동 (5초이상 로딩이면 에러발생)
                _a.sent();
                return [4 /*yield*/, page.waitForSelector(selectors.wait_for_bugs, { visible: true, timeout: 5000 })];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function (bug_selector) {
                        var bugs = [];
                        // 버그 타이틀과 링크 추출
                        var bug = document.querySelectorAll(bug_selector.bugs);
                        for (var i = 0; i < bug.length; i++) {
                            var linkData = {
                                title: '',
                                link: ''
                            };
                            linkData.title = 'S' + (i + 1) + ' : ' + bug[i].querySelector('.issue-message').textContent;
                            linkData.link = 'http://13.209.176.175:9000/issues?open=' + bug[i].getAttribute('data-issue') + '&resolved=false';
                            bugs.push(linkData);
                        }
                        ;
                        return bugs;
                    }, selectors)];
            case 3: 
            // 버그 정보 추출 후 리턴
            return [2 /*return*/, _a.sent()];
            case 4:
                error_1 = _a.sent();
                throw error_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
// 메인
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var bug_result, browser, page, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bug_result = [];
                return [4 /*yield*/, puppeteer.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, 6, 7]);
                // 리스트의 카드 삭제
                delete_all_cards();
                return [4 /*yield*/, get_bugs(page)];
            case 4:
                // 버그 가져오기
                bug_result = _a.sent();
                // 버그 내용으로 카드 추가
                create_cards(bug_result);
                return [3 /*break*/, 7];
            case 5:
                error_2 = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                browser.close();
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}); };
// 10초간 대기 후 메인 실행
setTimeout(function () { main(); }, 10000);
