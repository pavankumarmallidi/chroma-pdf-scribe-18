
import { supabase } from "@/integrations/supabase/client";

export interface PdfMetadata {
  id?: string;
  pdf_name: string;
  pdf_document: string;
  ocr_value: string;
  summary: string;
  num_pages: number;
  num_words: number;
  language: string;
  created_at?: string;
  updated_at?: string;
}

const getTableName = (userEmail: string): string => {
  return `pdf_${userEmail.replace(/[@.]/g, '_')}`;
};

export const createUserTableIfNotExists = async (userEmail: string): Promise<boolean> => {
  try {
    console.log('Checking if user table exists for:', userEmail);
    
    const { data: exists, error: checkError } = await supabase
      .rpc('check_user_table_exists', { user_email: userEmail });

    if (checkError) {
      console.error('Error checking table existence:', checkError);
      throw checkError;
    }

    if (exists) {
      console.log('Table already exists for user:', userEmail);
      return true;
    }

    console.log('Creating new table for user:', userEmail);
    const { data, error } = await supabase
      .rpc('create_user_pdf_table', { user_email: userEmail });

    if (error) {
      console.error('Error creating user table:', error);
      throw error;
    }

    console.log('Table created successfully for user:', userEmail);
    return data;
  } catch (error) {
    console.error('Error in createUserTableIfNotExists:', error);
    throw error;
  }
};

export const insertPdfMetadata = async (userEmail: string, metadata: Omit<PdfMetadata, 'id'>): Promise<string> => {
  try {
    console.log('Inserting PDF metadata for user:', userEmail);
    console.log('Metadata:', metadata);
    
    const tableName = getTableName(userEmail);
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([{
        pdf_name: metadata.pdf_name,
        pdf_document: metadata.pdf_document,
        ocr_value: metadata.ocr_value,
        summary: metadata.summary,
        num_pages: metadata.num_pages,
        num_words: metadata.num_words,
        language: metadata.language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting PDF metadata:', error);
      throw error;
    }

    console.log('PDF metadata inserted successfully:', data);
    return data.id;
  } catch (error) {
    console.error('Error in insertPdfMetadata:', error);
    throw error;
  }
};

export const getUserPdfs = async (userEmail: string): Promise<PdfMetadata[]> => {
  try {
    console.log('Fetching PDFs for user:', userEmail);
    
    const tableName = getTableName(userEmail);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user PDFs:', error);
      throw error;
    }

    console.log('Retrieved PDFs:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getUserPdfs:', error);
    throw error;
  }
};

export const getPdfById = async (userEmail: string, pdfId: string): Promise<PdfMetadata | null> => {
  try {
    console.log('Fetching PDF by ID for user:', userEmail, 'PDF ID:', pdfId);
    
    const tableName = getTableName(userEmail);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', pdfId)
      .single();

    if (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }

    console.log('Retrieved PDF:', data);
    return data;
  } catch (error) {
    console.error('Error in getPdfById:', error);
    throw error;
  }
};
