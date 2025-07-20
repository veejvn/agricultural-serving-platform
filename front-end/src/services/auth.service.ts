import axios, { service } from "@/tools/axios.tool";
import { getAuthUrl } from "@/tools/url.tool";
import { RegisterFormData } from "@/types/auth";

const AuthService = {
    register({ email, password} : RegisterFormData){
        return service(axios.post(getAuthUrl("/register"), {email, password}));
    },
}

export default AuthService