// 공통 API 응답 구조
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
