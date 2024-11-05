import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 30)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    // 유효하지않은 월을 어떻게 처리해야할까? 함수는 처리가 안되어있는데..
    expect(getDaysInMonth(2024, 0)).toBe(31);
    expect(getDaysInMonth(2024, 13)).toBe(31);
    expect(getDaysInMonth(2024, 14)).toBe(28);
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const wednesday = new Date('2024-11-06');
    const expectedWeekDates = [
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ];

    const result = getWeekDates(wednesday);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('주의 시작(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const sunday = new Date('2024-11-03');
    const expectedWeekDates = [
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ];

    const result = getWeekDates(sunday);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('주의 끝(토요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const saturday = new Date('2024-11-09');
    const expectedWeekDates = [
      new Date('2024-11-03'),
      new Date('2024-11-04'),
      new Date('2024-11-05'),
      new Date('2024-11-06'),
      new Date('2024-11-07'),
      new Date('2024-11-08'),
      new Date('2024-11-09'),
    ];

    const result = getWeekDates(saturday);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const lastDay = new Date('2024-12-31');
    const expectedWeekDates = [
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ];

    const result = getWeekDates(lastDay);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const firstDay = new Date('2025-01-01');
    const expectedWeekDates = [
      new Date('2024-12-29'),
      new Date('2024-12-30'),
      new Date('2024-12-31'),
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      new Date('2025-01-03'),
      new Date('2025-01-04'),
    ];

    const result = getWeekDates(firstDay);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const feburary = new Date('2024-02-26');
    const expectedWeekDates = [
      new Date('2024-02-25'),
      new Date('2024-02-26'),
      new Date('2024-02-27'),
      new Date('2024-02-28'),
      new Date('2024-02-29'),
      new Date('2024-03-01'),
      new Date('2024-03-02'),
    ];

    const result = getWeekDates(feburary);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const lastDayOfMonth = new Date('2024-10-31');
    const expectedWeekDates = [
      new Date('2024-10-27'),
      new Date('2024-10-28'),
      new Date('2024-10-29'),
      new Date('2024-10-30'),
      new Date('2024-10-31'),
      new Date('2024-11-01'),
      new Date('2024-11-02'),
    ];

    const result = getWeekDates(lastDayOfMonth);

    expect(result.map((date) => date.toISOString().slice(0, 10))).toEqual(
      expectedWeekDates.map((date) => date.toISOString().slice(0, 10))
    );
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const date = new Date('2024-07-01');
    const expectedWeeks = [
      [null, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 31, null, null, null],
    ];

    const result = getWeeksAtMonth(date);
    expect(result).toEqual(expectedWeeks);
  });
});

describe('getEventsForDay', () => {
  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const testEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '매주 월요일에 진행되는 팀 회의',
        location: '회의실 A',
        category: '회의',
        repeat: {
          type: 'weekly',
          interval: 1,
        },
        notificationTime: 30,
      },
      {
        id: '2',
        title: '프로젝트 발표',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 결과 발표회',
        location: '대강당',
        category: '발표',
        repeat: {
          type: 'monthly',
          interval: 1,
        },
        notificationTime: 60,
      },
      {
        id: '3',
        title: '점심 회식',
        date: '2024-11-20',
        startTime: '12:00',
        endTime: '13:00',
        description: '부서 연말 점심 회식',
        location: '레스토랑 B',
        category: '사교',
        repeat: {
          type: 'monthly',
          interval: 1,
        },
        notificationTime: 120,
      },
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
        startTime: '23:59',
        endTime: '23:59',
        description: '개인 프로젝트 제출 마감일',
        location: '온라인',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1440,
      },
    ];
    const testDate = 1;
    const result = getEventsForDay(testEvents, testDate);
    expect(result).toEqual([
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
        startTime: '23:59',
        endTime: '23:59',
        description: '개인 프로젝트 제출 마감일',
        location: '온라인',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1440,
      },
    ]);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const testEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '매주 월요일에 진행되는 팀 회의',
        location: '회의실 A',
        category: '회의',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2024-12-31',
        },
        notificationTime: 30,
      },
      {
        id: '2',
        title: '프로젝트 발표',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 결과 발표회',
        location: '대강당',
        category: '발표',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-05-15',
        },
        notificationTime: 60,
      },
      {
        id: '3',
        title: '점심 회식',
        date: '2024-11-20',
        startTime: '12:00',
        endTime: '13:00',
        description: '부서 연말 점심 회식',
        location: '레스토랑 B',
        category: '사교',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-20',
        },
        notificationTime: 120,
      },
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
        startTime: '23:59',
        endTime: '23:59',
        description: '개인 프로젝트 제출 마감일',
        location: '온라인',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1440,
      },
    ];
    const testDate = 2;
    const result = getEventsForDay(testEvents, testDate);
    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const testEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '매주 월요일에 진행되는 팀 회의',
        location: '회의실 A',
        category: '회의',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2024-12-31',
        },
        notificationTime: 30,
      },
      {
        id: '2',
        title: '프로젝트 발표',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 결과 발표회',
        location: '대강당',
        category: '발표',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-05-15',
        },
        notificationTime: 60,
      },
      {
        id: '3',
        title: '점심 회식',
        date: '2024-11-20',
        startTime: '12:00',
        endTime: '13:00',
        description: '부서 연말 점심 회식',
        location: '레스토랑 B',
        category: '사교',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-20',
        },
        notificationTime: 120,
      },
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
        startTime: '23:59',
        endTime: '23:59',
        description: '개인 프로젝트 제출 마감일',
        location: '온라인',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1440,
      },
    ];
    const testDate = 0;
    const result = getEventsForDay(testEvents, testDate);
    expect(result).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const testEvents: Event[] = [
      {
        id: '1',
        title: '팀 회의',
        date: '2024-11-10',
        startTime: '09:00',
        endTime: '10:00',
        description: '매주 월요일에 진행되는 팀 회의',
        location: '회의실 A',
        category: '회의',
        repeat: {
          type: 'weekly',
          interval: 1,
          endDate: '2024-12-31',
        },
        notificationTime: 30,
      },
      {
        id: '2',
        title: '프로젝트 발표',
        date: '2024-11-15',
        startTime: '14:00',
        endTime: '15:00',
        description: '프로젝트 결과 발표회',
        location: '대강당',
        category: '발표',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-05-15',
        },
        notificationTime: 60,
      },
      {
        id: '3',
        title: '점심 회식',
        date: '2024-11-20',
        startTime: '12:00',
        endTime: '13:00',
        description: '부서 연말 점심 회식',
        location: '레스토랑 B',
        category: '사교',
        repeat: {
          type: 'monthly',
          interval: 1,
          endDate: '2025-12-20',
        },
        notificationTime: 120,
      },
      {
        id: '4',
        title: '개인 프로젝트 마감일',
        date: '2024-12-01',
        startTime: '23:59',
        endTime: '23:59',
        description: '개인 프로젝트 제출 마감일',
        location: '온라인',
        category: '개인',
        repeat: {
          type: 'none',
          interval: 0,
        },
        notificationTime: 1440,
      },
    ];
    const testDate = 32;
    const result = getEventsForDay(testEvents, testDate);
    expect(result).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2024-11-15');
    const result = formatWeek(targetDate);
    expect(result).toBe('2024년 11월 2주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2024-11-05');
    const result = formatWeek(targetDate);
    expect(result).toBe('2024년 11월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2024-11-30');
    const result = formatWeek(targetDate);
    expect(result).toBe('2024년 11월 4주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2024-12-31');
    const result = formatWeek(targetDate);
    expect(result).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2024-02-29');
    const result = formatWeek(targetDate);
    expect(result).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const targetDate = new Date('2023-02-28');
    const result = formatWeek(targetDate);
    expect(result).toBe('2023년 3월 1주');
  });
});

describe('formatMonth', () => {
  it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
    const testDate = new Date('2024-07-10');
    expect(formatMonth(testDate)).toBe('2024년 7월');
  });
});

describe('isDateInRange', () => {
  const rangeStart = new Date('2024-07-01');
  const rangeEnd = new Date('2024-07-31');

  it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-10');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-01');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
    const testDate = new Date('2024-07-31');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(true);
  });

  it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-06-30');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(false);
  });

  it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-08-01');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(false);
  });

  it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
    const testDate = new Date('2024-08-01');
    const result = isDateInRange(testDate, rangeStart, rangeEnd);
    expect(result).toBe(false);
  });
});

describe('fillZero', () => {
  //여기는 it이 아니라 test로 시나리오를 작성했네??
  test("5를 2자리로 변환하면 '05'를 반환한다", () => {
    expect(fillZero(5, 2)).toBe('05');
  });

  test("10을 2자리로 변환하면 '10'을 반환한다", () => {
    expect(fillZero(10, 2)).toBe('10');
  });

  test("3을 3자리로 변환하면 '003'을 반환한다", () => {
    expect(fillZero(3, 3)).toBe('003');
  });

  test("100을 2자리로 변환하면 '100'을 반환한다", () => {
    expect(fillZero(100, 2)).toBe('100');
  });

  test("0을 2자리로 변환하면 '00'을 반환한다", () => {
    expect(fillZero(0, 2)).toBe('00');
  });

  test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
    expect(fillZero(1, 5)).toBe('00001');
  });

  test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
    expect(fillZero(3.14, 5)).toBe('03.14');
  });

  test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
    expect(fillZero(5)).toBe('05');
  });

  test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
    expect(fillZero(1000, 2)).toBe('1000');
  });
});

describe('formatDate', () => {
  it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
    const testDate = new Date('2024-11-05');
    expect(formatDate(testDate)).toBe('2024-11-05');
  });

  it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
    const testDate = new Date('2024-11-05');
    expect(formatDate(testDate, 7)).toBe('2024-11-07');
  });

  it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const testDate = new Date('2024-01-05');
    expect(formatDate(testDate)).toBe('2024-01-05');
    expect(formatDate(testDate, 7)).toBe('2024-01-07');
  });

  it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
    const testDate = new Date('2024-01-05');
    expect(formatDate(testDate)).toBe('2024-01-05');
    expect(formatDate(testDate, 7)).toBe('2024-01-07');
  });
});
