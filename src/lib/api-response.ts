import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Generates a unique request ID for tracking API requests.
 */
export function generateRequestId(): string {
  return `req_${crypto.randomBytes(8).toString("hex")}`;
}

export interface ApiResponseOptions {
  success: boolean;
  message: string;
  data?: any;
  meta?: any;
  error?: {
    code: string;
    field?: string;
    fields?: Record<string, string[]>;
  };
  requestId: string;
}

/**
 * Standardized API Response formatter.
 */
export function apiResponse(options: ApiResponseOptions, status: number = 200) {
  return NextResponse.json(options, { status });
}

/**
 * Standardized Success Response helper.
 */
export function sendSuccess(
  data: any,
  message: string,
  requestId: string,
  meta: any = null,
  status: number = 200
) {
  return apiResponse(
    {
      success: true,
      message,
      data,
      meta,
      requestId,
    },
    status
  );
}

/**
 * Standardized Error Response helper.
 */
export function sendError(
  code: string,
  message: string,
  requestId: string,
  status: number = 400,
  details?: { field?: string; fields?: Record<string, string[]> }
) {
  return apiResponse(
    {
      success: false,
      message,
      error: {
        code,
        ...details,
      },
      requestId,
    },
    status
  );
}
