import React, { createContext, useContext, useState, ReactNode } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc,setDoc } from "firebase/firestore";
import { useRouter } from 'expo-router';
import { auth, db } from './Firebase';
type LoginResult =
  | { success: true; role: "candidate" | "company" }
  | { success: false; error: string };
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  login: (email: string, password: string) => Promise<
    | { success: true; role: "candidate" | "company" }
    | { success: false; error: string }
  >;
  logout: () => void;
  registerCandidate: (candidateData: any) => Promise<void>;
  registerCompany: (companyData: any) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Nuevo estado
  const router = useRouter();

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log(uid);
      setUserId(uid);
      // Verifica si el usuario existe en las colecciones
      const candidateDoc = await getDoc(doc(db, "candidates", uid));
      const companyDoc = await getDoc(doc(db, "companies", uid));
      console.log('Hola aqui estoy');
      if (candidateDoc.exists()) {
        setUserRole("candidate");
        setIsAuthenticated(true);
        router.replace('/candidates/(home)/profile');
        return { success: true, role: "candidate" }; // Éxito con rol
      } else if (companyDoc.exists()) {
        setUserRole("company");
        setIsAuthenticated(true);
        router.replace('/companies/(home)/profile');
        return { success: true, role: "company" }; // Éxito con rol
      } else {
        throw new Error("El correo no tiene un perfil asociado.");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      return { success: false, error: error.message || "Error desconocido" };
    }
  };
  
  


  const logout = () => {
    router.push('/auth/initiallogin');
    auth.signOut();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };
  const registerCandidate = async (candidateData: any) => {
    console.log("datos",candidateData);

    try {
      const { email, password, ...candidateProfile } = candidateData;

      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log("Intentando registrar candidato en Firestore");
      setUserId(uid);
      // Guardar datos en Firestore bajo el UID
      await setDoc(doc(db, "candidates", uid), {
        ...candidateProfile,
        email,
        createdAt: new Date(),
      });

      console.log("Candidato registrado exitosamente.");
    } catch (error) {
      console.error("Error al registrar candidato:", error);
    }
  };
  const registerCompany = async (companyData: any) => {
    try {
      const { email, password, ...companyProfile } = companyData;
  
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      setUserId(uid);
      // Guardar datos de la compañía en Firestore
      await setDoc(doc(db, "companies", uid), {
        ...companyProfile,
        email,
        createdAt: new Date(),
      });
  
      console.log("Compañía registrada exitosamente.");
    } catch (error) {
      console.error("Error al registrar la compañía:", error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole,userId, login, logout,registerCandidate, registerCompany}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
