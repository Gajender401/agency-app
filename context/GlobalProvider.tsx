import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosInstance } from "axios";

interface GlobalContextProps {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  apiCaller: AxiosInstance;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  userData: User | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  editData: any,
  setInvoiceData: React.Dispatch<React.SetStateAction<Package | null>>;
  invoiceData: Package | null
  refresh:boolean,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  photos: Array<string>
  setPhotos: React.Dispatch<React.SetStateAction<Array<string>>>
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

const baseURL = process.env.EXPO_PUBLIC_URL as string;

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjhjMTc0YWQ5NTliNjgwNjdjOTdlMzYiLCJyb2xlIjoiQUdFTkNZIiwiaWF0IjoxNzIxMjExMTY3fQ.Yf861s4Qyr2TS-K_J1vkL5eTYEngwmZI5YLhSZ4Lmuk");
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [editData, setEditData] = useState<any>()
  const [invoiceData, setInvoiceData] = useState<Package | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [photos, setPhotos] = useState<Array<string>>([])

  useEffect(() => {
    SecureStore.getItemAsync("access_token")
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setToken(res);
          console.log(res);
          
        } else {
          setToken(token);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);

  const apiCaller = axios.create({
    baseURL,
    onUploadProgress: (progressEvent) => { },
    withCredentials: true,
    headers: {
      "authtoken": `${token}`,
    },
  });

  async function fetchUser() {
    const response = await apiCaller.get('/api/user/');
    setUserData(response.data.data)
  }

  useEffect(() => {
    if (token) {
      fetchUser()
    }
  }, [token])

  apiCaller.interceptors.response.use(
    (response) => response,
    // (error) => Promise.reject(error?.response?.data?.err),
    (error) => Promise.reject(error),
  );

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
        setUserData,
        setEditData,
        editData,
        invoiceData,
        setInvoiceData,
        refresh,
        setRefresh,
        photos,
        setPhotos
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
