import { supabase } from './supabaseClient';

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id: string | null;
  category: string;
  subject: string;
  description: string;
  attachments: string[] | null;
  status: string;
  created_at: string;
}

export const supportService = {
  async submitTicket(data: {
    category: string;
    subject: string;
    description: string;
    order_id?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('support_tickets')
      .insert([{ ...data, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as SupportTicket;
  },

  async getMyTickets(): Promise<SupportTicket[]> {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as SupportTicket[];
  },
};
