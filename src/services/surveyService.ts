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

    // Ensure user exists in public.users table (sync from auth if trigger was missed)
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userData.user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase
          .from('users')
          .insert({
            id: userData.user.id,
            email: userData.user.email!,
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'User',
            phone: userData.user.user_metadata?.phone || '',
          });
      }
    } catch (e) {
      console.warn('[surveyService] User sync caught error:', e);
    }

    const { data: result, error } = await supabase
      .from('surveys')
      .insert([{ ...data, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as Survey;
  },

  async getMySurveys(): Promise<Survey[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Survey[];
  },

  async getSurveyHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    surveys: Survey[];
    total: number;
  }> {
    // Get total count
    const { count, error: countError } = await supabase
      .from('surveys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw new Error(countError.message);

    // Get paginated surveys
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      surveys: data as Survey[],
      total: count || 0,
    };
  },

  async getSurveyStats(userId: string): Promise<{
    totalSurveys: number;
    completedSurveys: number;
    quotedSurveys: number;
    averageQuoteAmount: number;
  }> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const surveys = data as Survey[];
    const quotedSurveys = surveys.filter((s) => s.quote_amount).length;
    const totalQuoteAmount = surveys.reduce((sum, s) => sum + (s.quote_amount || 0), 0);

    return {
      totalSurveys: surveys.length,
      completedSurveys: surveys.filter((s) => s.status === 'completed').length,
      quotedSurveys,
      averageQuoteAmount: quotedSurveys > 0 ? totalQuoteAmount / quotedSurveys : 0,
    };
  },
};
