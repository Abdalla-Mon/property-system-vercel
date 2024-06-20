"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Failed, Success } from "@/app/components/loading/ToastUpdate";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const [checkAccess, setCheckAccess] = useState(false);
  useEffect(() => {
    async function auth() {
      setCheckAccess(true);
      const toastId = toast.loading("يتم التحقق من الصلاحيات...");
      const response = await fetch(`/api/auth/state`, { cache: "no-store" });
      const result = await response.json();

      if (result.auth === false) {
        router.push("/login");
        toast.update(toastId, Failed("غير مصرح. جاري التوجيه"));
        setIsLoggedIn(false);
        setUser({});
      } else {
        toast.update(
          toastId,
          Success("مصرح. جاري تحميل البيانات الرجاء الانتظار..."),
        );
        setIsLoggedIn(result.auth);
        setUser(result.user);
      }
    }

    auth();
  }, [redirect]);

  useEffect(() => {
    if (isLoggedIn && user) {
      const checkAccess = () => {
        setCheckAccess(true);
        const userPrivileges = user.privileges.reduce((acc, priv) => {
          acc[priv.area] = priv.privilege;
          return acc;
        }, {});

        const pathMap = {
          "/login": "HOME",
          "/": "HOME",
          "/follow-up": "FOLLOW_UP",
          "/properties": "PROPERTY",
          "/units": "UNIT",
          "/rent": "RENT",
          "/invoices": "INVOICE",
          "/maintenance": "MAINTENANCE",
          "/reports": "REPORT",
          "/owners": "OWNER",
          "/renters": "RENTER",
          "/settings": "SETTING",
        };

        const area = Object.keys(pathMap).find((key) => pathName.includes(key))
          ? pathMap[Object.keys(pathMap).find((key) => pathName.includes(key))]
          : null;

        setCheckAccess(false);

        if (area && userPrivileges[area]?.canRead) {
          return true;
        }
        router.push("/not-allowed");

        return false;
      };

      checkAccess();
    } else {
      setCheckAccess(false);
    }
  }, [isLoggedIn, pathName, user?.privileges, user]);
  const renderContent = () => {
    if (!isLoggedIn) {
      return pathName === "/login" ? children : null;
    } else {
      return !checkAccess ? children : null;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        setRedirect,
        redirect,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {renderContent()}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
