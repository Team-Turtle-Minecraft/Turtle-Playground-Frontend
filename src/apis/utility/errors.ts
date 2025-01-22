export class ParametersValidationError extends Error {
  missingFields: any;
  constructor(missingFields: any) {
    super(`필수 입력란 누락: ${missingFields.join(", ")}`);
    this.name = this.constructor.name;
    this.missingFields = missingFields;
  }
}

export class UserNotFoundErrorInTurtlePlayGround extends Error {
  message: string;
  constructor(message: string) {
    super("유효하지 않은 요청.");
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class AlreadyExistNicknameError extends Error {
  message: string;
  constructor(message: string) {
    super("유효하지 않은 요청.");
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class AlreadyExistUserError extends Error {
  message: string;
  constructor(message: string) {
    super("유효하지 않은 요청.");
    this.name = this.constructor.name;
    this.message = message;
  }
}
