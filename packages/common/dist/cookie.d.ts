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
export declare function encode(name: string, value: string, attributes: CookieAttributes): string;
export declare function parse(cookieString: string): {
    [name: string]: string;
};
export declare function getAll(): {
    [name: string]: string;
};
export declare function get(name: string): string | undefined;
export declare function set(name: string, value: string, attributes?: CookieAttributes): void;
export declare function remove(name: string, attributes?: CookieAttributes): void;
