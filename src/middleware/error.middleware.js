import { ApiError } from '../utils/ApiError.js'
import { CONFIG } from '../config/index.js'
import { removeFileFromLocal } from '../utils/fileUtils.js'

export const errorHandler = async (err, req, res, next) => {
    let error = err

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || 'Something went wrong'
        error = new ApiError(
            statusCode,
            message,
            error?.errors || [],
            err.stack
        )
    }

    // Trash File Removal If Exists
    const file = req.file
    if (file) await removeFileFromLocal(file.path)

    const response = {
        ...error,
        message: error.message,
        ...(CONFIG.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    }
    return res.status(error.statusCode).json(response)
}
