import React, { createContext, useContext, useState, ReactNode } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { trace } from 'firebase/performance';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import performanceObject, { db } from '../auth/Firebase';
interface FirebaseContextType {
  createDocument: (collectionName: string, data: any) => Promise<void>;
  readDocuments: (collectionName: string, filterField?: string, filterValue?: string) => Promise<any[]>;
  updateDocument: (collectionName: string, id: string, data: any) => Promise<void>;
  deleteDocument: (collectionName: string, id: string) => Promise<void>;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const createDocument = async (collectionName: string, data: any) => {
    console.log(`[CREATE] Inicio de creación de documento en "${collectionName}"`, data);

    const customTrace = trace(performanceObject, 'createDocument'); // Crea una traza personalizada
    customTrace.start(); // Inicia la traza

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log(`[CREATE] Documento creado exitosamente con ID: ${docRef.id}`);
    } catch (error) {
      console.error(`[CREATE] Error al crear documento en "${collectionName}":`, error);
    } finally {
      customTrace.stop(); // Detiene la traza
      setLoading(false);
      console.log(`[CREATE] Operación finalizada en "${collectionName}"`);
    }
  };

  const readDocuments = async (collectionName: string, filterField?: string, filterValue?: string) => {
    console.log(`[READ] Inicio de lectura de documentos en "${collectionName}"`);
    if (filterField && filterValue) {
      console.log(`[READ] Aplicando filtro: ${filterField} = "${filterValue}"`);
    }

    const customTrace = trace(performanceObject, 'readDocuments'); // Crea una traza personalizada
    customTrace.start(); // Inicia la traza

    setLoading(true);
    try {
      let q;
      if (filterField && filterValue) {
        q = query(collection(db, collectionName), where(filterField, '==', filterValue));
      } else {
        q = collection(db, collectionName);
      }
      const querySnapshot = await getDocs(q);
      console.log('snapchot: ',querySnapshot.docs);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`[READ] Documentos recuperados:`, results);
      return results;
    } catch (error) {
      console.error(`[READ] Error al leer documentos de "${collectionName}":`, error);
      return [];
    } finally {
      customTrace.stop(); // Detiene la traza
      setLoading(false);
      console.log(`[READ] Operación finalizada en "${collectionName}"`);
    }
  };

  const updateDocument = async (collectionName: string, id: string, data: any) => {
    console.log(`[UPDATE] Inicio de actualización de documento en "${collectionName}" con ID: ${id}`, data);

    const customTrace = trace(performanceObject, 'updateDocument'); // Crea una traza personalizada
    customTrace.start(); // Inicia la traza

    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      const res = await updateDoc(docRef, data);
      console.log(`[UPDATE] Documento con ID: ${id} actualizado exitosamente`);
      return res;
    } catch (error) {
      console.error(`[UPDATE] Error al actualizar documento en "${collectionName}" con ID: ${id}`, error);
    } finally {
      customTrace.stop(); // Detiene la traza
      setLoading(false);
      console.log(`[UPDATE] Operación finalizada en "${collectionName}"`);
    }
  };

  const deleteDocument = async (collectionName: string, id: string) => {
    console.log(`[DELETE] Inicio de eliminación de documento en "${collectionName}" con ID: ${id}`);

    const customTrace = trace(performanceObject, 'deleteDocument'); // Crea una traza personalizada
    customTrace.start(); // Inicia la traza

    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`[DELETE] Documento con ID: ${id} eliminado exitosamente`);
    } catch (error) {
      console.error(`[DELETE] Error al eliminar documento en "${collectionName}" con ID: ${id}`, error);
    } finally {
      customTrace.stop(); // Detiene la traza
      setLoading(false);
      console.log(`[DELETE] Operación finalizada en "${collectionName}"`);
    }
  };

  return (
    <FirebaseContext.Provider value={{ createDocument, readDocuments, updateDocument, deleteDocument, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase debe ser usado dentro de FirebaseProvider');
  }
  return context;
};