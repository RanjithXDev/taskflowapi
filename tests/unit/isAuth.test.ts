import jwt from 'jsonwebtoken';
import { isAuth } from '../../src/middleware/isAuth';

const mockReq = (token ? : string) =>({
    header: {
        authorization : token ? `Bearer ${token}` : undefined
    }
});

const mockResponces =() =>{
    const re
}