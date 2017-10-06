import * as Winston from "winston";

function getEnvironmentVariable(key: string, defaultValue: string): string {
    const value: string = process.env[key];

    if (!value) {
        const message = `Environment variable with key '${key}' not found. Using default: '${defaultValue}'.`;
        Winston.warn(message);

        return defaultValue;
    }

    return value;
}

function convertToInt(value: string): number {
    const converted = parseInt(value, 10);

    if (isNaN(converted)) {
        const message = `Could not convert '${value}' to int`;
        Winston.error(message);
        throw new Error(message);
    }

    return converted;
}

export default {
    uiPort: convertToInt(getEnvironmentVariable("UI_PORT", "7000")),
};
