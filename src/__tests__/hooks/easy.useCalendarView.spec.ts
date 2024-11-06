import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { assertDate } from '../utils.ts';

describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    expect(result.current.view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    // it('currentDate는 오늘 날짜이어야 한다', () => {
    // 오늘날짜는 매번 바뀔수있으니까 description에 날짜를 직접적으로 지정하지않는게 좋을까?
    const { result } = renderHook(() => useCalendarView());
    const date = new Date('2024-10-01');
    assertDate(result.current.currentDate, date);
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', () => {
    //지금은 11월인데 10월기준으로 테스트를 하고있네?
    // it('holidays는 현재 월에 맞는 공휴일이 지정되어 있어야 한다', () => {
    // 매번 현재 날짜가 바뀔텐데, 현재 날짜를 고정할수있는 방법이 있을까? -> setupTests.ts 파일에 setSystemTime로 현재 날짜를 설정하고있네
    const { result } = renderHook(() => useCalendarView());
    const expectedHolidays = {
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    };
    expect(result.current.holidays).toEqual(expectedHolidays);
  });
});

it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
  const { result } = renderHook(() => useCalendarView());
  act(() => {
    // result.current.view = 'week'; 이렇게 작성하면 테스트코드는 통과하더라도 React가 상태변화 감지 불가
    result.current.setView('week');
  });
  expect(result.current.view).toBe('week');
});

it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
  const { result } = renderHook(() => useCalendarView());
  const currentDate = new Date('2024-10-08');
  act(() => {
    result.current.setView('week');
  });
  act(() => {
    result.current.navigate('next');
  });
  assertDate(result.current.currentDate, currentDate);
});

it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
  const { result } = renderHook(() => useCalendarView());
  const currentDate = new Date('2024-09-24');
  act(() => {
    result.current.setView('week');
  });
  act(() => {
    result.current.navigate('prev');
  });
  assertDate(result.current.currentDate, currentDate);
});

it("월간 뷰에서 다음으로 navigate시 한 달 전 '2024-11-01' 날짜여야 한다", () => {
  const { result } = renderHook(() => useCalendarView());
  const currentDate = new Date('2024-11-01');
  act(() => {
    result.current.setView('month');
  });
  act(() => {
    result.current.navigate('next');
  });
  assertDate(result.current.currentDate, currentDate);
});

it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
  const { result } = renderHook(() => useCalendarView());
  const currentDate = new Date('2024-09-01');
  act(() => {
    result.current.setView('month');
  });
  act(() => {
    result.current.navigate('prev');
  });
  assertDate(result.current.currentDate, currentDate);
});

it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
  const { result } = renderHook(() => useCalendarView());
  act(() => {
    result.current.setCurrentDate(new Date('2024-01-01'));
  });
  expect(result.current.holidays).toEqual({ '2024-01-01': '신정' });
});
