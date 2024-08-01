import {Injectable} from '@angular/core';
import {AuthChangeEvent, Session, SupabaseClient,} from '@supabase/supabase-js';
import {SupabaseService} from "../../shared/services/supabase.service";

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private _supabase: SupabaseClient;

  constructor(private _supabaseService: SupabaseService) {
    this._supabase = _supabaseService.supabase
  }

  public get session() {
    return this._supabase.auth.getSession();
  }

  public authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this._supabase.auth.onAuthStateChange(callback);
  }

  public signIn(email: string, password: string) {
    return this._supabase.auth.signInWithPassword({email, password});
  }

  public signOut() {
    return this._supabase.auth.signOut();
  }

  public signUp(email: string, password: string, emailRedirectTo?: string) {
    return this._supabase.auth.signUp({
      email, password, options: emailRedirectTo
        ? {
          emailRedirectTo
        }
        : undefined
    })
  }
}
