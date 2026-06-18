import DataUri from 'datauri/parser.js';
import path from 'path';


const GetBufferFromFile = (file: any) => {
    const parser = new DataUri();
    const extName = path.extname(file.originalname).toString();
    const Buffer = parser.format(extName, file.buffer);
    return Buffer;
}
export default GetBufferFromFile;