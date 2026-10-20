import { ENV } from "@repo/config";
import { CommandExitError, Sandbox } from '@e2b/code-interpreter';

interface LanguageConfig {
    runtime: string;
    extension: string;
    compileCmd?: string;
}

const languageConfig: Record<string, LanguageConfig> = {

    python: {
        runtime: 'python3',
        extension: '.py',
    },
    javascript: {
        runtime: 'node',
        extension: '.js',
    },
    cpp: {
        runtime: 'g++',
        extension: '.cpp',
        compileCmd: 'g++ {file} -o /tmp/program && /tmp/program' 
    }

}

class E2BExecuter {

    #apiKey: string;

    constructor() {
        this.#apiKey = ENV.E2B_API_KEY || '';
        if(!this.#apiKey) throw new Error('E2B_API_KEY is required');
    }

    async execute(
        sourceCode: string,
        language: string,
        type: 'run' | 'submit'
    ) {

        const config = languageConfig[language];

        if(!config) throw new Error(`Unsupported language: ${language}`);

        const fileName = `/tmp/main${config.extension}`;

        const sbx = await Sandbox.create({ apiKey: this.#apiKey })

        try {
            await sbx.files.write(fileName, sourceCode);
            const cmd = config.compileCmd ? 
                config.compileCmd.replace('{file}', fileName) : 
                `${config.runtime} ${fileName}`;

            const startTime = Date.now();

            try{
                const process = await sbx.commands.run(cmd, {
                    timeoutMs: 5000
                });

                return {
                    output: process.stdout,
                    error: process.stderr,
                    exitCode: process.exitCode,
                    executionTimeMs: Date.now() - startTime
                }
            } catch(err) {
                if(err instanceof CommandExitError) {
                    return {
                        output: err.stdout ?? '',
                        error: err.stderr ?? '',
                        exitCode: err.exitCode ?? 1,
                        executionTimeMs: Date.now() - startTime
                    }
                }
                throw err;
            }
        } finally {
            await sbx.kill();
        }


        
    }

}

const executor = new E2BExecuter();

export { executor };