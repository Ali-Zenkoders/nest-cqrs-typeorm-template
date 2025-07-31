import { ICommand } from '@nestjs/cqrs';
import { IQuery } from '@nestjs/cqrs';

/**
 * Abstract base class for typed CQRS commands in NestJS.
 *
 * This class allows each command to declare its expected return type
 * via a generic parameter `T`, enabling strong typing when executing
 * the command with the `CommandBus`.
 *
 * **IMPORTANT:** To infer the return type in consumers using
 * `typeof MyCommand.returnType`, you must manually add the static
 * property `static readonly returnType` in your derived class.
 *
 * @template T - The expected return type of the command when executed.
 *
 * @example
 * export class CreateUserCommand extends TypedCommand<Result<User>> {
 *   constructor(public readonly email: string) {
 *     super();
 *   }
 *
 *   // Required for type inference
 *   static readonly returnType: Result<User>;
 * }
 *
 * // Usage
 * const [user, error]: typeof CreateUserCommand.returnType =
 *   await commandBus.execute(new CreateUserCommand('john@example.com'));
 */
export abstract class TypedCommand<T> implements ICommand {
  /** Placeholder for generic type inference */
  readonly returnType!: T;
}

/**
 * Abstract base class for typed CQRS queries in NestJS.
 *
 * Declares the expected return type using a generic, enabling
 * type-safe results with the QueryBus.
 *
 * **IMPORTANT:** You must declare `static readonly returnType`
 * in your derived class to enable `typeof MyQuery.returnType`.
 *
 * @template T - Expected result type for the query.
 *
 * @example
 * export class GetUserQuery extends TypedQuery<Result<User>> {
 *   constructor(public readonly userId: string) {
 *     super();
 *   }
 *
 *   static readonly returnType: Result<User>;
 * }
 *
 * const [user, error]: typeof GetUserQuery.returnType =
 *   await queryBus.execute(new GetUserQuery('123'));
 */
export abstract class TypedQuery<T> implements IQuery {
  /** Placeholder for generic type inference */
  readonly returnType!: T;
}
