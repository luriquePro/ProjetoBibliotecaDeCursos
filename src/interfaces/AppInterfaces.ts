import { IncomingMessage, ServerResponse } from "http";

export type IRequest = IncomingMessage;
export type IResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

export interface IRoute {
	path: string;
	method: "POST" | "GET" | "PATCH" | "DELETE";
	handler: (req: IRequest, res: IResponse) => Promise<IResponse> | IResponse;
}
