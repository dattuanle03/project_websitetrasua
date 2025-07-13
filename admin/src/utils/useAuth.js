import { useEffect, useState } from "react";

const useAuth = () => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Giả lập kiểm tra session/token nếu cần
    setTimeout(() => {
      setChecking(false);
    }, 100); // Giả lập độ trễ
  }, []);

  return { checking };
};

export default useAuth;
