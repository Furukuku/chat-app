import router from "@/router";
import axios from "axios";

const useGuest = async (token: string, url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200) {
      return;
    }

    return router.push('/');
  } catch (err) {
    return router.push('/');
  }
};

export default useGuest;