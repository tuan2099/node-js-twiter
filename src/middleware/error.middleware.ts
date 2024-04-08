import { Request, Response, NextFunction } from 'express'

import httpStatus from "~/constants/httpStatus";
import { omit } from 'lodash'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))

}