// test2 브랜치테스트
// 버그정보
export interface bug_data {
    title: string;
    link: string;
}

// 결과
export interface result {
    // 200: 성공 | 500: 실패
    status: 200 | 500;
    // 에러 메세지
    error_msg? : string;
    // 사용자 정보
    bugs : bug_data[];
}
