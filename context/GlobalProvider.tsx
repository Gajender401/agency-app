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
  userName: string | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setInvoiceData: React.Dispatch<React.SetStateAction<Invoice | null>>;
  invoiceData: Invoice | null
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
  const [userName, setUserName] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>()
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null)

  const baseURL = process.env.EXPO_PUBLIC_URL as string;

  useEffect(() => {
    // SecureStore.getItemAsync("access_token")
    //   .then((res) => {
    //     if (res) {
    //       setIsLogged(true);
    //       setToken(res);
    //     } else {
    setIsLogged(true);
    setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjdmZTYwZjI4NWZjNDdmODc4ZjMzMDgiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MTk4MjYyNTB9.7ibc5WF_zDMSENrCsrxJDpyANzE-31DO26i3hTDVN_Y");
    //   }
    // })
    // .catch((error) => {
    //   console.log(error);
    // })
    // .finally(() => {
    //   setLoading(false);
    // });
  }, []);

  const apiCaller = axios.create({
    baseURL,
    onUploadProgress: (progressEvent) => { },
    withCredentials: true,
    headers: {
      "authtoken": `${token}`,
    },
  });

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
        userName,
        setUserName,
        setEditData,
        editData,
        invoiceData,
        setInvoiceData
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
