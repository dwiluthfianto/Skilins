"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ComponentType } from "react";

const withRole = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: string[],
  loginRedirectPath: string
) => {
  const WithRole: React.FC<P> = (props) => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    const userRole = Cookies.get("userRole");

    useEffect(() => {
      if (!userRole) {
        router.push(loginRedirectPath);
      } else if (!allowedRoles.includes(userRole)) {
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setLoading(false); // Set loading to false if the user has the correct role
      }
    }, [userRole, allowedRoles, router, loginRedirectPath]);

    if (loading) {
      return <div>Loading...</div>; // Show a loading state while determining the role
    }

    return userRole && allowedRoles.includes(userRole) ? (
      <WrappedComponent {...props} />
    ) : null;
  };

  return WithRole;
};

export default withRole;
