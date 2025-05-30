import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

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

// Environment variables for Supabase configuration
const SUPABASE_URL = https://jxcvonbmosywkqtomrbl.supabase.co;
const SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y3ZvbmJtb3N5d2txdG9tcmJsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQyNzY1NiwiZXhwIjoyMDY0MDAzNjU2fQ.eGq_KeaiOErsqbNV2bpAUm9FEvoDWG3e4cet_CdE_q8;
const SUPABASE_ANON_KEY =eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y3ZvbmJtb3N5d2txdG9tcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjc2NTYsImV4cCI6MjA2NDAwMzY1Nn0.L3oc3QtOnBBqxVIhiLimQub3LBG_GJWmw_SV-fkXGfU;

// Admin client for table creation and management operations
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Regular client for data operations
const userSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Creates a user-specific PDF table if it doesn't exist
 */
export const createUserTableIfNotExists = async (userEmail: string): Promise<boolean> => {
  try {
    console.log('Creating user table for:', userEmail);
    
    const { data, error } = await adminSupabase.rpc('create_user_pdf_table', {
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

/**
 * Gets the table name for a specific user
 */
export const getUserTableName = async (userEmail: string): Promise<string> => {
  try {
    const { data, error } = await adminSupabase.rpc('get_user_table_name', {
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

/**
 * Inserts PDF metadata into user's table
 */
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
    console.log('Inserting PDF metadata for:', userEmail, pdfData);
    
    const { data, error } = await adminSupabase.rpc('insert_pdf_metadata', {
      user_email: userEmail,
      ...pdfData
    });

    if (error) {
      console.error('Error inserting PDF metadata:', error);
      throw error;
    }

    console.log('PDF metadata inserted with ID:', data);
    return data;
  } catch (error) {
    console.error('Failed to insert PDF metadata:', error);
    throw error;
  }
};

/**
 * Fetches all PDFs for a specific user
 */
export const getUserPdfs = async (userEmail: string): Promise<PdfMetadata[]> => {
  try {
    console.log('Fetching PDFs for user:', userEmail);
    
    const tableName = await getUserTableName(userEmail);
    console.log('Using table name:', tableName);
    
    const { data, error } = await userSupabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user PDFs:', error);
      throw error;
    }

    console.log('Fetched PDFs:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch user PDFs:', error);
    throw error;
  }
};

/**
 * Fetches a specific PDF by ID for a user
 */
export const getPdfById = async (userEmail: string, pdfId: string): Promise<PdfMetadata | null> => {
  try {
    console.log('Fetching PDF by ID:', pdfId, 'for user:', userEmail);
    
    const tableName = await getUserTableName(userEmail);
    console.log('Using table name:', tableName);
    
    const { data, error } = await userSupabase
      .from(tableName)
      .select('*')
      .eq('id', pdfId)
      .single();

    if (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }

    console.log('Fetched PDF:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch PDF by ID:', error);
    throw error;
  }
};

/**
 * Updates PDF metadata for a specific user
 */
export const updatePdfMetadata = async (
  userEmail: string,
  pdfId: string,
  updateData: Partial<Omit<PdfMetadata, 'id' | 'created_at'>>
): Promise<PdfMetadata> => {
  try {
    console.log('Updating PDF metadata for:', userEmail, pdfId, updateData);
    
    const tableName = await getUserTableName(userEmail);
    
    const { data, error } = await userSupabase
      .from(tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', pdfId)
      .select()
      .single();

    if (error) {
      console.error('Error updating PDF metadata:', error);
      throw error;
    }

    console.log('PDF metadata updated:', data);
    return data;
  } catch (error) {
    console.error('Failed to update PDF metadata:', error);
    throw error;
  }
};

/**
 * Deletes a PDF record for a specific user
 */
export const deletePdf = async (userEmail: string, pdfId: string): Promise<boolean> => {
  try {
    console.log('Deleting PDF:', pdfId, 'for user:', userEmail);
    
    const tableName = await getUserTableName(userEmail);
    
    const { error } = await userSupabase
      .from(tableName)
      .delete()
      .eq('id', pdfId);

    if (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }

    console.log('PDF deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete PDF:', error);
    throw error;
  }
};

/**
 * Checks if a user table exists
 */
export const checkUserTableExists = async (userEmail: string): Promise<boolean> => {
  try {
    const { data, error } = await adminSupabase.rpc('check_user_table_exists', {
      user_email: userEmail
    });

    if (error) {
      console.error('Error checking table existence:', error);
      return false;
    }

    return data;
  } catch (error) {
    console.error('Failed to check table existence:', error);
    return false;
  }
};

/**
 * Gets PDF count for a user
 */
export const getUserPdfCount = async (userEmail: string): Promise<number> => {
  try {
    const tableName = await getUserTableName(userEmail);
    
    const { count, error } = await userSupabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting PDF count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get PDF count:', error);
    return 0;
  }
};
