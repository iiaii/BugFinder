import * as chai from 'chai';
import bugfinder from '../src/bugfinder';
import * as interfaces from '../src/interfaces'
const assert = chai.assert;

// 소나큐브 버그 가져오기 테스트 
describe('# 소나큐브 버그 가져오기 테스트', () => {
    it('버그 정보 여부?', async () => {
        const result : interfaces.result = await bugfinder();
        console.log(result);
        // 테스트 성공
        if (result.status === 200) {
            assert.isObject(result, '형식 확인');
            for(let i=0 ; i<result.bugs.length ; i++) {
                assert.isString(result.bugs[i].title, '버그 제목 확인');
                assert.isString(result.bugs[i].link, '버그 링크 확인');
            }
            assert.ok(true, '버그 가져오기 성공');
        } else if (result.status === 500) {  // 테스트 실패
            assert.ok(false, '버그 가져오기 실패');
        }
    });
});