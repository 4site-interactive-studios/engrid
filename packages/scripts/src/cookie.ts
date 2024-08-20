/**
Example:
import * as cookie from "./cookie";

cookie.set('name', 'value');
cookie.get('name'); // => 'value'
cookie.remove('name');
cookie.set('name', 'value', { expires: 7 }); // 7 Days cookie
cookie.set('name', 'value', { expires: 7, path: '' }); // Set Path
cookie.remove('name', { path: '' });
 */

export interface CookieAttributes {
  /**
   * A number will be interpreted as days from time of creation
   */
  expires?: Date | number;

  /**
   * Hosts to which the cookie will be sent
   */
  domain?: string;

  /**
   * The cookie will only be included in an HTTP request if the request
   * path matches (or is a subdirectory of) the cookie's path attribute.
   */
  path?: string;

  /**
   * If enabled, the cookie will only be included in an HTTP request
   * if it is transmitted over a secure channel (typically HTTP over TLS).
   */
  secure?: boolean;

  /**
   * Only send the cookie if the request originates from the same website the
   * cookie is from. This provides some protection against cross-site request
   * forgery attacks (CSRF).
   *
   * The strict mode witholds the cookie from any kind of cross-site usage
   * (including inbound links from external sites). The lax mode witholds
   * the cookie on cross-domain subrequests (e.g. images or frames), but
   * sends it whenever a user navigates safely from an external site (e.g.
   * by following a link).
   */
  sameSite?: "strict" | "lax" | "none";
}

function stringifyAttribute(
  name: string,
  value: string | boolean | undefined
): string {
  if (!value) {
    return "";
  }

  let stringified = "; " + name;

  if (value === true) {
    return stringified; // boolean attributes shouldn't have a value
  }

  return stringified + "=" + value;
}

function stringifyAttributes(attributes: CookieAttributes): string {
  if (typeof attributes.expires === "number") {
    let expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() + attributes.expires * 864e5
    );
    attributes.expires = expires;
  }

  return (
    stringifyAttribute(
      "Expires",
      attributes.expires ? attributes.expires.toUTCString() : ""
    ) +
    stringifyAttribute("Domain", attributes.domain) +
    stringifyAttribute("Path", attributes.path) +
    stringifyAttribute("Secure", attributes.secure) +
    stringifyAttribute("SameSite", attributes.sameSite)
  );
}

export function encode(
  name: string,
  value: string,
  attributes: CookieAttributes
): string {
  return (
    encodeURIComponent(name)
      .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent) // allowed special characters
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29") + // replace opening and closing parens
    "=" +
    encodeURIComponent(value)
      // allowed special characters
      .replace(
        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
        decodeURIComponent
      ) +
    stringifyAttributes(attributes)
  );
}

export function parse(cookieString: string): { [name: string]: string } {
  let result: { [name: string]: string } = {};
  let cookies = cookieString ? cookieString.split("; ") : [];
  let rdecode = /(%[\dA-F]{2})+/gi;

  for (let i = 0; i < cookies.length; i++) {
    let parts = cookies[i].split("=");
    let cookie = parts.slice(1).join("=");

    if (cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      let name = parts[0].replace(rdecode, decodeURIComponent);
      result[name] = cookie.replace(rdecode, decodeURIComponent);
    } catch (e) {
      // ignore cookies with invalid name/value encoding
    }
  }

  return result;
}

export function getAll(): { [name: string]: string } {
  return parse(document.cookie);
}

export function get(name: string): string | undefined {
  return getAll()[name];
}

export function set(
  name: string,
  value: string,
  attributes?: CookieAttributes
): void {
  document.cookie = encode(name, value, { path: "/", ...attributes });
}

export function remove(name: string, attributes?: CookieAttributes): void {
  set(name, "", { ...attributes, expires: -1 });
}
