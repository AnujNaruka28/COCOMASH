import {
    codeChangeSchema,
    codeStateRequestSchema,
    codeAwarenessSchema
} from "./dto";

import {
    handleCodeChange,
    handleCodeStateRequest,
    handleCodeAwareness
} from "./handlers";

const codeEvents = [
    {
        event: "code:change",
        schema: codeChangeSchema,
        handler: handleCodeChange,
    },
    {
        event: "code:state:request",
        schema: codeStateRequestSchema,
        handler: handleCodeStateRequest
    },
    {
        event: "code:awareness",
        schema: codeAwarenessSchema,
        handler: handleCodeAwareness
    }
]

export default codeEvents;