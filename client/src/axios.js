import axios from 'axios';

const instance= axios.create({
    baseURL:"https://hungryhub-20xe.onrender.com/"
})

export default instance