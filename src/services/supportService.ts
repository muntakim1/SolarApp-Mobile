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

export interface TicketImage {
  uri: string;
  name: string;
  type: string;
}

export const supportService = {
  async submitTicket(data: {
    category: string;
    subject: string;
    description: string;
    order_id?: string;
    attachments?: TicketImage[];
  }) {
    // Ensure user is authenticated
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
      console.warn('[supportService] User sync caught error:', e);
    }

    // Upload images if provided
    let attachmentUrls: string[] = [];
    if (data.attachments && data.attachments.length > 0) {
      attachmentUrls = await Promise.all(
        data.attachments.map((image, index) => uploadTicketImage(userData.user.id, image, index))
      );
    }

    const { data: result, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          category: data.category,
          subject: data.subject,
          description: data.description,
          order_id: data.order_id || null,
          user_id: userData.user.id,
          attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result as SupportTicket;
  },

  async getMyTickets(): Promise<SupportTicket[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as SupportTicket[];
  },

  async getSupportHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    tickets: SupportTicket[];
    total: number;
  }> {
    // Get total count
    const { count, error: countError } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw new Error(countError.message);

    // Get paginated tickets
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      tickets: data as SupportTicket[],
      total: count || 0,
    };
  },

  async getSupportStats(userId: string): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    averageResolutionTime: number; // in hours
  }> {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    const tickets = data as SupportTicket[];
    const openTickets = tickets.filter((t) => t.status === 'open').length;
    const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;

    return {
      totalTickets: tickets.length,
      openTickets,
      resolvedTickets,
      averageResolutionTime: 48, // Placeholder - would calculate from timestamps
    };
  },
};

/**
 * Upload image to Supabase Storage
 */
async function uploadTicketImage(userId: string, image: TicketImage, index: number): Promise<string> {
  try {
    const filename = `${userId}/${Date.now()}_${index}_${image.name}`;
    const bucket = 'support-attachments';

    // Convert URI to blob
    const response = await fetch(image.uri);
    const blob = await response.blob();

    const { error } = await supabase.storage.from(bucket).upload(filename, blob, {
      contentType: image.type,
      cacheControl: '3600',
    });

    if (error) {
      console.error('[supportService] Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filename);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('[supportService] Image upload failed:', error);
    throw new Error('Failed to upload image');
  }
}
