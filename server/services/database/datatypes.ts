export default class Datatype {
    public static int(length?: number) {
        if (!!length && (length < -2147483648 || length > 2147483647)) {
            throw new Error('Length must be between -2147483648 and 2147483647');
        }
        if (!length) {
            length = 11;
        }
        return `INT(${length})`;
    }

    public static varchar(length?: number) {
        if (!!length && (length < 0 || length > 65535)) {
            throw new Error('Length must be between 0 and 65535');
        }
        if (length === undefined) {
            length = 255;
        }
        return `VARCHAR(${length})`;
    }

    public static text(length?: number) {
        if (!!length && (length < 0 || length > 65535)) {
            throw new Error('Length must be between 0 and 65535');
        }
        if (length === undefined) {
            length = 65535;
        }
        return `TEXT(${length})`;
    }

    public static tinyint(length?: number) {
        if (!!length && (length < -128 || length > 127)) {
            throw new Error('Length must be between -128 and 127');
        }
        if (length === undefined) {
            length = 4;
        }
        return `TINYINT(${length})`;
    }

    public static smallint(length?: number) {
        if (!!length && (length < -32768 || length > 32767)) {
            throw new Error('Length must be between -32768 and 32767');
        }
        if (length === undefined) {
            length = 6;
        }
        return `SMALLINT(${length})`;
    }

    public static mediumint(length?: number) {
        if (!!length && (length < -8388608 || length > 8388607)) {
            throw new Error('Length must be between -8388608 and 8388607');
        }
        if (length === undefined) {
            length = 9;
        }
        return `MEDIUMINT(${length})`;
    }

    public static bigint(length?: number) {
        if (!!length && (length < -9223372036854775808 || length > 9223372036854775807)) {
            throw new Error('Length must be between -9223372036854775808 and 9223372036854775807');
        }
        if (length === undefined) {
            length = 20;
        }
        return `BIGINT(${length})`;
    }

    public static float(decimals?: number) {
        if (!!decimals && (decimals < 0 || decimals > 53)) {
            throw new Error('Decimals must be between 0 and 53');
        }
        if (decimals === undefined) {
            decimals = 2;
        }
        return `FLOAT(${decimals})`;
    }

    public static boolean() {
        return 'BOOLEAN';
    }

    public static date() {
        return 'DATE';
    }

    public static datetime() {
        return 'DATETIME';
    }

    public static timestamp() {
        return 'TIMESTAMP';
    }
}