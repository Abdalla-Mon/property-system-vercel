export const getCurrentPrivilege = (user, pathName) => {
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
  return user.privileges.find((priv) => priv.area === pathMap[pathName]);
};
