import jwt from 'jsonwebtoken';
import { isAuth } from '../../src/middleware/isAuth';

const mockReq = (token ? : string) =>({
    header: {
        authorization : token ? `Bearer ${token}` : undefined
    }
});

const mockResponces =() =>{
    const res : any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
};

describe("Is Auth testing", ()=>{
    it("It will pass with valid JWT", ()=>{
        const token = jwt.sign({ userId: "123"}, "access-secret")
    })
}