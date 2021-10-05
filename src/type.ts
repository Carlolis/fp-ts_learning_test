import * as t from 'io-ts';

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol;
}
export declare const NonEmptyString: t.BrandC<t.StringC, NonEmptyStringBrand>;

interface EmailStringBrand {
  readonly EmailString: unique symbol;
}
/**
 * @since 2.0.0
 */
export declare const EmailString: t.BrandC<t.StringC, EmailStringBrand>;

/**
 * Non empty trimmed email string with max length 64 validated by validator.js.
 *
 * @since 2.0.0
 */
export declare const Email: t.IntersectionC<
  [
    t.BrandC<t.StringC, NonEmptyStringBrand>,
    t.BrandC<t.StringC, EmailStringBrand>
  ]
>;
export declare type Email = t.TypeOf<typeof Email>;
