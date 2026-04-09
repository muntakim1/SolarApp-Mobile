import { supabase } from './supabaseClient';

export interface Survey {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  property_type: string;
  address: string;
  monthly_bill: number;
  preferred_date: string;
  notes: string | null;
  status: string;
  scheduled_at: string | null;
  quote_amount: number | null;
  quote_details: any;
  created_at: string;
}

export const surveyService = {
  async submitSurvey(data: {
    full_name: string;
    phone: string;
    property_type: string;
    address: string;
    monthly_bill: number;
    preferred_date: string;
    notes?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('surveys')
      .insert([{ ...data, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as Survey;
  },

  async getMySurveys(): Promise<Survey[]> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Survey[];
  },
};
