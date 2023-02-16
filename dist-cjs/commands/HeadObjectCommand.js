"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadObjectCommand = void 0;
const middleware_endpoint_1 = require("@aws-sdk/middleware-endpoint");
const middleware_serde_1 = require("@aws-sdk/middleware-serde");
const middleware_ssec_1 = require("@aws-sdk/middleware-ssec");
const smithy_client_1 = require("@aws-sdk/smithy-client");
const models_0_1 = require("../models/models_0");
const Aws_restXml_1 = require("../protocols/Aws_restXml");
class HeadObjectCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    static getEndpointParameterInstructions() {
        return {
            Bucket: { type: "contextParams", name: "Bucket" },
            ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
            UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
            DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
            Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
            UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
            UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
            Endpoint: { type: "builtInParams", name: "endpoint" },
            Region: { type: "builtInParams", name: "region" },
            UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
        };
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use((0, middleware_serde_1.getSerdePlugin)(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use((0, middleware_endpoint_1.getEndpointPlugin)(configuration, HeadObjectCommand.getEndpointParameterInstructions()));
        this.middlewareStack.use((0, middleware_ssec_1.getSsecPlugin)(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "S3Client";
        const commandName = "HeadObjectCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.HeadObjectRequestFilterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.HeadObjectOutputFilterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return (0, Aws_restXml_1.serializeAws_restXmlHeadObjectCommand)(input, context);
    }
    deserialize(output, context) {
        return (0, Aws_restXml_1.deserializeAws_restXmlHeadObjectCommand)(output, context);
    }
}
exports.HeadObjectCommand = HeadObjectCommand;