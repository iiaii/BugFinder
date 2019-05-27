import puppeteer from 'puppeteer';
import request from 'request';
import * as interfaces from './interfaces';

// 트렐로 정보 
const trello = {
    idList: '5cc69a5b1d138f81d45e4188',
    idLabels: '5ca486cd5cbe2c824836ec31',
    key: '5b6cdfa6cf36c0ffd91e542cdfa187bd',
    token: '0e0f637f865af876a7a2b256840973d5e6413302be0a11a1db5ab2ac730702f0'
}

// 페이지 정보
const urls = {
    sonarqube_page: 'http://13.209.176.175:9000/project/issues?id=CTIP_EX&resolved=false&severities=MAJOR',
}

// 셀렉터 영역
const selectors = {
    wait_for_bugs: '#issues-page > div.layout-page-main > div.layout-page-main-inner > div > div > div:nth-child(1) > div.issues-workspace-list-component.note > div',
    bugs: '.issue'
}

// 리스트의 카드 전부 삭제
const delete_all_cards = () => {
    const options = { 
        method: 'POST',
        url: 'https://api.trello.com/1/lists/'+trello.idList+'/archiveAllCards',
        qs: 
        { 
            key: trello.key,
            token: trello.token 
        }
    };
      
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    });
}

// 카드 추가
const create_cards = (bug_result: interfaces.bug_data[]) => {
    for(let i=0 ; i<bug_result.length ; i++){
        let options = { method: 'POST',
        url: 'https://api.trello.com/1/cards',
        qs: 
        { 
            name: bug_result[i].title,
            desc: bug_result[i].link,
            idList: trello.idList,
            idLabels: trello.idLabels,
            keepFromSource: 'all',
            key: trello.key,
            token: trello.token } 
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
        });
    }
}

// 버그 가져오기
const get_bugs = async (page: puppeteer.Page): Promise<interfaces.bug_data[]> => {
    try {
        // 소나큐브 페이지 이동 (5초이상 로딩이면 에러발생)
        await page.goto(urls.sonarqube_page);
        await page.waitForSelector(selectors.wait_for_bugs, { visible: true,timeout: 5000 });

        // 버그 정보 추출 후 리턴
        return await page.evaluate((bug_selector) => {
            let bugs: interfaces.bug_data[] = [];

            // 버그 타이틀과 링크 추출
            const bug = document.querySelectorAll(bug_selector.bugs);
            for(let i=0 ; i<bug.length ; i++) {
                const linkData: interfaces.bug_data = {
                    title: '',
                    link: ''
                };
                linkData.title = 'S'+(i+1) +' : '+bug[i].querySelector('.issue-message').textContent;
                linkData.link = 'http://13.209.176.175:9000/issues?open='+ bug[i].getAttribute('data-issue') +'&resolved=false';
                bugs.push(linkData);
            };
            return bugs;
        }, selectors);
    } catch (error) {
        throw error;
    }
};

// 메인
export default async (): Promise<interfaces.result> => {

    let bug_result: interfaces.bug_data[] = [];

    // 브라우저 / 페이지 변수 초기 설정 (퍼펫티어)
    const browser: puppeteer.Browser = await puppeteer.launch();
    const page: puppeteer.Page = await browser.newPage();

    try {
        // 리스트의 카드 삭제
        delete_all_cards();        

        // 버그 가져오기
        bug_result = await get_bugs(page); 
        
        // 버그 내용으로 카드 추가
        create_cards(bug_result);
        
        return {
            status: 200,
            bugs: bug_result,
        };
    } catch (error) {
        return {
            status: 500,
            error_msg: error,
            bugs: bug_result
        };
    } finally {
        browser.close();
    }
};
