
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

// Create an untyped client for dynamic table operations
const SUPABASE_URL = "https://jxcvonbmosywkqtomrbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y3ZvbmJtb3N5d2txdG9tcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjc2NTYsImV4cCI6MjA2NDAwMzY1Nn0.L3oc3QtOnBBqxVIhiLimQub3LBG_GJWmw_SV-fkXGfU";

const untypedSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export const createUserTableIfNotExists = async (userEmail: string): Promise<boolean> => {
  try {
    console.log('Creating user table for:', userEmail);
    
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
    console.log('Inserting PDF metadata for:', userEmail, pdfData);
    
    const { data, error } = await supabase.rpc('insert_pdf_metadata', {
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

export const getUserPdfs = async (userEmail: string): Promise<PdfMetadata[]> => {
  try {
    console.log('Fetching PDFs for user:', userEmail);
    
    const tableName = await getUserTableName(userEmail);
    console.log('Using table name:', tableName);
    
    // Use untyped client for dynamic table queries
    const { data, error } = await untypedSupabase
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

export const getPdfById = async (userEmail: string, pdfId: string): Promise<PdfMetadata | null> => {
  try {
    console.log('Fetching PDF by ID:', pdfId, 'for user:', userEmail);
    
    const tableName = await getUserTableName(userEmail);
    console.log('Using table name:', tableName);
    
    // Use untyped client for dynamic table queries
    const { data, error } = await untypedSupabase
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
