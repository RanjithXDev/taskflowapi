import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (value : string) =>{
    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttribbutes: {},
    });
};