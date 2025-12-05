'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Json } from '@/types/supabase';

export interface Notification {
  id: string;
  profile_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationsResult {
  success: boolean;
  error?: string;
  data?: Notification[];
  unreadCount?: number;
}

export interface NotificationResult {
  success: boolean;
  error?: string;
  data?: Notification;
}

/**
 * Get all notifications for the current user
 */
export async function getNotifications(limit = 20): Promise<NotificationsResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    // Get notifications
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (notifError) {
      return { success: false, error: notifError.message };
    }

    // Count unread
    const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

    return {
      success: true,
      data: notifications as Notification[],
      unreadCount
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: true, count: 0 };
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { success: true, count: 0 };
    }

    // Count unread notifications
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
      .eq('is_read', false);

    if (countError) {
      return { success: false, count: 0, error: countError.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<NotificationResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: notification, error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/notifications');

    return { success: true, data: notification as Notification };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return { success: false, error: 'Profile not found' };
    }

    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('profile_id', profile.id)
      .eq('is_read', false);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/notifications');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error: deleteError } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath('/notifications');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Create a notification (typically called from server-side code)
 */
export async function createNotification(
  profileId: string,
  type: string,
  title: string,
  message: string,
  link?: string,
  data?: Json
): Promise<NotificationResult> {
  try {
    const supabase = await createClient();

    const { data: notification, error: createError } = await supabase
      .from('notifications')
      .insert({
        profile_id: profileId,
        type,
        title,
        message,
        link: link || null,
        data: data ?? undefined,
        is_read: false
      })
      .select()
      .single();

    if (createError) {
      return { success: false, error: createError.message };
    }

    return { success: true, data: notification as Notification };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}
