// Here is a refactored version of the provided code with a new module for logging:
import * as vscode from "vscode";

/**
 * A logging module that writes inputs to an output channel.
 */
class Logger {
    private outputChannel: vscode.OutputChannel;
    private static instance: Logger;
    /**
     * Private constructor to prevent instantiation outside of the class.
     * @param channelName The name of the output channel to write logs to.
     */
    constructor(channelName: string) {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
    }
    /**
     * Writes a message to the output channel.
     * @param message The message to write.
     */
    public write(message: string) {
        this.outputChannel.appendLine(`[${new Date().toLocaleString()}] ${message}`);
    }
    /**
     * Times an async function and logs the result.
     * @param func The async function to time.
     * @param message The message to log with the timing result.
     */
    public async time(message: string, func: Function) {
        const start = new Date().getTime();
        await func();
        const end = new Date().getTime();
        const duration = end - start;
        this.write(`[ ${message} ] took ${duration} ms.`);
    }
}
export default new Logger("vs-gpt-rocket");
// The `timeAsyncFunction` function takes an async function and a message as arguments, times the function execution, and logs the result to the output channel using the `write` function.