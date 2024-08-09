import axios from 'axios';

const instance= axios.create({
    baseURL:"https://hungryhub-backend-gn2s.onrender.com/"
})

export default instance