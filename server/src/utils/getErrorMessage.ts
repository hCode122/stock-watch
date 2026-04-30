/**
 * Simple error message extractor
 */
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    
    if (typeof error === 'string') {
        return error;
    }
    
    if (error && typeof error === 'object') {
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
        if ('msg' in error && typeof error.msg === 'string') {
            return error.msg;
        }
        if ('error' in error && typeof error.error === 'string') {
            return error.error;
        }
    }
    
    return 'An unexpected error occurred';
};