import { HttpException } from '@nestjs/common';

/**
 * Represents a successful outcome of an operation.
 * It is a tuple where the first element is the success value and the second is `null`.
 * @template T The type of the success value.
 */
export type Success<T> = [T, null];

/**
 * Represents a failed outcome of an operation.
 * It is a tuple where the first element is `null` and the second is the error value.
 * @template E The type of the error value. Defaults to `HttpException`.
 */
export type Failure<E = HttpException> = [null, E];

/**
 * Represents the outcome of an operation, which can be either a `Success` or a `Failure`.
 * This type enforces that one of the two values in the tuple is always `null`.
 * @template T The type of the success value.
 * @template E The type of the error value. Defaults to `HttpException`.
 */
export type Result<T, E = HttpException> = Success<T> | Failure<E>;

/**
 * Represents a numeric range as a tuple.
 *
 * This tuple consists of exactly two numbers:
 * - The first element is the start of the range (inclusive).
 * - The second element is the end of the range (inclusive).
 *
 * @example
 * const range: RangeTuple = [1, 50]; // represents the range from 1 to 50
 */
export type RangeTuple = [number, number];
