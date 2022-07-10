import axios from "axios";

export default class PostService {
    static async getALL() {
        try {
            const response = await axios.get('http://localhost:8080/api/users/');
            return response.data
        } catch (e) {
            console.log(e)
        }
    }
}