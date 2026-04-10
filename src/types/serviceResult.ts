export type ServiceSuccess<T> = {
  success: true;
  data: T;
};

export type ServiceError<E> = {
  success: false;
  error: E;
};

export type ServiceResult<T, E> = ServiceSuccess<T> | ServiceError<E>;
