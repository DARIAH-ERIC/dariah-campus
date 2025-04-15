/**
 * Note that validation assumes `isRequired: true`.
 *
 * @see https://github.com/Thinkmill/keystatic/issues/1261
 */

export const email = { regex: /.+?@.+?/, message: "Must be a valid email address." };

export const twitter = { regex: /^@.+/, message: "Must start with an '@' character." };

export const urlFragment = {
	regex: /^[^#].+/,
	message: "Must not include the leading '#' character.",
};
