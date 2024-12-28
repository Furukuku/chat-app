import router from "@/router";
import axios from "axios";

const useAuth = async (token: string, url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return response.data.user;
    }

    return router.push('/login');
  } catch (err) {
    return router.push('/login');
  }
};

export default useAuth;