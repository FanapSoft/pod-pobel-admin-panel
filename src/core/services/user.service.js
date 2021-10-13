const UserFieldKey = "userObjectAdmin";

export const getUser = () => {
    return (window.localStorage.getItem(UserFieldKey) ?  JSON.parse(window.localStorage.getItem(UserFieldKey)) : false);
};

export const saveUser = user => {
    window.localStorage.setItem(UserFieldKey, JSON.stringify(user));
};

export const destroyUser = () => {
    window.localStorage.removeItem(UserFieldKey);
};

export default { getUser, saveUser, destroyUser };
