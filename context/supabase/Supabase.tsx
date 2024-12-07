import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';

interface SupabaseContextType {
    createDocument: (table: string, data: any) => Promise<void>;
    readDocuments: (table: string, filterField?: string, filterValue?: string) => Promise<any[]>;
    updateDocument: (table: string, id: string, data: any) => Promise<void>;
    deleteDocument: (table: string, id: string) => Promise<void>;
    uploadFile: (file: File, bucket: string, folderPath: string) => Promise<string>;
    loading: boolean;
  }
  
  const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);
  
  export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
  
    // Crear un documento
    const createDocument = async (table: string, data: any) => {
      setLoading(true);
      try {
        const { error } = await supabase.from(table).insert(data);
        if (error) throw error;
        console.log(`[CREATE] Documento creado exitosamente en la tabla "${table}"`);
      } catch (error) {
        console.error(`[CREATE] Error al crear documento en "${table}":`, error);
      } finally {
        setLoading(false);
      }
    };
  
    // Leer documentos
    const readDocuments = async (table: string, filterField?: string, filterValue?: string) => {
      setLoading(true);
      try {
        let query = supabase.from(table).select('*');
        if (filterField && filterValue) {
          query = query.eq(filterField, filterValue);
        }
        const { data, error } = await query;
        if (error) throw error;
        console.log(`[READ] Documentos recuperados de la tabla "${table}":`, data);
        return data || [];
      } catch (error) {
        console.error(`[READ] Error al leer documentos de "${table}":`, error);
        return [];
      } finally {
        setLoading(false);
      }
    };
  
    // Actualizar un documento
    const updateDocument = async (table: string, id: string, data: any) => {
      setLoading(true);
      try {
        const { error } = await supabase.from(table).update(data).eq('id', id);
        if (error) throw error;
        console.log(`[UPDATE] Documento con ID "${id}" actualizado exitosamente en la tabla "${table}"`);
      } catch (error) {
        console.error(`[UPDATE] Error al actualizar documento en "${table}":`, error);
      } finally {
        setLoading(false);
      }
    };
  
    // Eliminar un documento
    const deleteDocument = async (table: string, id: string) => {
      setLoading(true);
      try {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        console.log(`[DELETE] Documento con ID "${id}" eliminado exitosamente de la tabla "${table}"`);
      } catch (error) {
        console.error(`[DELETE] Error al eliminar documento en "${table}":`, error);
      } finally {
        setLoading(false);
      }
    };
  
    // Subir un archivo
    const uploadFile = async (file: File, bucket: string, folderPath: string): Promise<string> => {
      setLoading(true);
      try {
        const { data, error } = await supabase.storage.from(bucket).upload(`${folderPath}/${file.name}`, file);
        if (error) throw error;
        const info = supabase.storage.from(bucket).getPublicUrl(data.path);
        console.log(`[UPLOAD] Archivo subido correctamente: ${info.data.publicUrl}`);
        return info.data.publicUrl || '';
      } catch (error) {
        console.error(`[UPLOAD] Error al subir el archivo:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <SupabaseContext.Provider value={{ createDocument, readDocuments, updateDocument, deleteDocument, uploadFile, loading }}>
        {children}
      </SupabaseContext.Provider>
    );
  };
  
  export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
      throw new Error('useSupabase debe ser usado dentro de SupabaseProvider');
    }
    return context;
  };