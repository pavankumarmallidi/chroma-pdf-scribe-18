
import { supabase } from '@/integrations/supabase/client';

export interface PdfMetadata {
  id: string;
  pdf_name: string;
  pdf_document?: string;
  ocr_value?: string;
  summary?: string;
  num_pages?: number;
  num_words?: number;
  language?: string;
  created_at: string;
  updated_at: string;
}

export const createUserTableIfNotExists = async (userEmail: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('create_user_pdf_table', {
      user_email: userEmail
    });

    if (error) {
      console.error('Error creating user table:', error);
      throw error;
    }

    console.log('User table check/creation result:', data);
    return data;
  } catch (error) {
    console.error('Failed to create user table:', error);
    throw error;
  }
};

export const getUserTableName = async (userEmail: string): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_user_table_name', {
      user_email: userEmail
    });

    if (error) {
      console.error('Error getting user table name:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user table name:', error);
    throw error;
  }
};

export const insertPdfMetadata = async (
  userEmail: string,
  pdfData: {
    pdf_name: string;
    pdf_document?: string;
    ocr_value?: string;
    summary?: string;
    num_pages?: number;
    num_words?: number;
    language?: string;
  }
): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('insert_pdf_metadata', {
      user_email: userEmail,
      ...pdfData
    });

    if (error) {
      console.error('Error inserting PDF metadata:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to insert PDF metadata:', error);
    throw error;
  }
};

export const getUserPdfs = async (userEmail: string): Promise<PdfMetadata[]> => {
  try {
    const tableName = await getUserTableName(userEmail);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user PDFs:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch user PDFs:', error);
    throw error;
  }
};

export const getPdfById = async (userEmail: string, pdfId: string): Promise<PdfMetadata | null> => {
  try {
    const tableName = await getUserTableName(userEmail);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', pdfId)
      .single();

    if (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch PDF by ID:', error);
    throw error;
  }
};
