import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
// import * as SecureStore from "expo-secure-store";
import axios, { AxiosInstance } from "axios";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  userData: UserData | undefined;
  userEmail: string | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  editData: any
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>()

  const baseURL = process.env.EXPO_PUBLIC_URL as string;

  // useEffect(() => {
  //   SecureStore.getItemAsync("access_token")
  //     .then((res) => {
  //       if (res) {
  //         setIsLogged(true);
  //         setToken(res);
  //       } else {
  //         setIsLogged(false);
  //         setToken(null);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  const apiCaller = axios.create({
    baseURL,
    onUploadProgress: (progressEvent) => {},
    // withCredentials: true,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });

  apiCaller.interceptors.response.use(
    (response) => response,
    // (error) => Promise.reject(error?.response?.data?.err),
    (error) => Promise.reject(error),
  );

  async function fetchuserData() {
    // try {
    //     const res = await apiCaller.get('/api/teachers/app/teacher-profile-creation/');
    //     setUserData(res.data[0]);
    // } catch (error) {
    //     console.log(error);
    // }
  }

  useEffect(() => {
    console.log(token);
    if (token) {
      fetchuserData();
    }
  }, [token]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        apiCaller,
        token,
        setToken,
        loading,
        userData,
        userEmail,
        setUserEmail,
        setEditData,
        editData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
