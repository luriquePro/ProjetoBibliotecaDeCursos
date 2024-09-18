import { IncomingMessage, ServerResponse } from "http";

export interface IRequest extends IncomingMessage {
	query?: { [key: string]: string | number };
}

export type IResponse = ServerResponse<IncomingMessage> & { req: IncomingMessage };

export interface IRoute {
	path: string;
	method: "POST" | "GET" | "PATCH" | "DELETE";
	handler: (req: IRequest, res: IResponse) => Promise<IResponse> | IResponse;
}

export interface IMessageReturn {
	message: string;
	is_error: boolean;
	statusCode: number;
}
