import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { REGION } from "./const.mjs";

// The AWS Region can be provided here using the `region` property. If you leave it blank
// the SDK will default to the region set in your AWS config.
const snsClient = new SNSClient({ region: REGION });
export { snsClient, PublishCommand }

